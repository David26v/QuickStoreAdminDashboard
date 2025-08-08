"use client";
import React, { useEffect, useState } from 'react';
import {
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Shield,
  CreditCard,
  ScanFace,
  Hand,
  Package,
  CalendarClock,
  AlertCircle,
  Pencil,
  Save,
  X,
  Check,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; 
import { useParams } from 'next/navigation';
import supabase from '@/lib/helper';
import QuickStoreLoading from '@/components/ui/QuickStoreLoading';

const ClientView = () => {
  const { client_id } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  const [availableAuthMethods, setAvailableAuthMethods] = useState([]);
  const [selectedAuthMethodIds, setSelectedAuthMethodIds] = useState([]);
  const [initialSelectedAuthMethodIds, setInitialSelectedAuthMethodIds] = useState([]);
  const [availableLockers, setAvailableLockers] = useState([]);
  const [assignedLockerIds, setAssignedLockerIds] = useState([]);
  const [initialAssignedLockerIds, setInitialAssignedLockerIds] = useState([]);
  const [clientSettingsId, setClientSettingsId] = useState(null); 

  const authMethodDisplayMap = {
    'qr': { label: 'QR Code', icon: Package },
    'code': { label: 'Access Code', icon: FileText },
    'biometric': { label: 'Biometric', icon: ScanFace },
    'card_reader': { label: 'Card Reader', icon: CreditCard }, 
    'default': { label: 'Auth Method', icon: Shield }
  };

  const loadClientData = async () => {
    if (!client_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);
    setSaveMessage({ type: '', text: '' });
    try {
      const { data: clientInfo, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          name,
          location,
          contact_person,
          email,
          phone,
          notes,
          created_at,
          updated_at,
          lockers (
            id,
            name,
            assigned_at
          )
        `)
        .eq("id", client_id)
        .single();

      if (clientError) {
        console.error("Supabase error fetching client information:", clientError.message);
        setFetchError(clientError.message);
        setClientData(null);
        return;
      }

      let authMethodsList = [];
      let settingsId = null;
      const { data: settingsData, error: settingsError } = await supabase
        .from('client_locker_settings')
        .select('id')
        .eq('client_id', client_id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settingsData) {
        settingsId = settingsData.id; 
        setClientSettingsId(settingsData.id); 
        const { data: clientAuthMethodsData, error: clientAuthMethodsError } = await supabase
          .from('client_auth_methods')
          .select('auth_method_id')
          .eq('client_setting_id', settingsData.id);

        if (clientAuthMethodsError) throw clientAuthMethodsError;
        const authMethodIds = clientAuthMethodsData?.map(item => item.auth_method_id) || [];

        if (authMethodIds.length > 0) {
          const { data: authMethodsData, error: authMethodsError } = await supabase
            .from('auth_methods')
            .select('technical_name, name')
            .in('id', authMethodIds)
            .eq('is_active', true);

          if (authMethodsError) throw authMethodsError;
          authMethodsList = authMethodsData?.map(method => ({
            technical_name: method.technical_name,
            name: method.name,
            displayKey: method.technical_name && authMethodDisplayMap[method.technical_name] ? method.technical_name : 'default'
          })) || [];
        }
      } else {
          setClientSettingsId(null);
      }

      const fullClientData = {
        ...clientInfo,
        auth_methods: authMethodsList
      };

      setClientData(fullClientData);
      setEditedData({
        name: clientInfo.name || '',
        location: clientInfo.location || '',
        contact_person: clientInfo.contact_person || '',
        email: clientInfo.email || '',
        phone: clientInfo.phone || '',
        notes: clientInfo.notes || '',
      });

      const initialAuthIds = authMethodsList.map(m => m.technical_name).map(tn => {
          const method = availableAuthMethods.find(am => am.technical_name === tn);
          return method ? method.id : null;
      }).filter(id => id !== null);

      setSelectedAuthMethodIds(initialAuthIds);
      setInitialSelectedAuthMethodIds(initialAuthIds);

      const initialLockerIds = clientInfo.lockers?.map(l => l.id) || [];
      setAssignedLockerIds(initialLockerIds);
      setInitialAssignedLockerIds(initialLockerIds);

    } catch (err) {
      console.error("Unexpected error fetching client information:", err.message, err);
      setFetchError(err.message || 'An unexpected error occurred.');
      setClientData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAvailableData = async () => {
        try {
            const { data: authMethodsData, error: authMethodsError } = await supabase
                .from('auth_methods')
                .select('id, name, technical_name')
                .eq('is_active', true);

            if (authMethodsError) throw authMethodsError;
            setAvailableAuthMethods(authMethodsData || []);

            const { data: lockersData, error: lockersError } = await supabase
                .from('lockers')
                .select('id, name, client_id'); 

            if (lockersError) throw lockersError;
            setAvailableLockers(lockersData || []);

        } catch (err) {
            console.error("Error fetching available auth methods/lockers:", err);
        }
    };
    fetchAvailableData();
  }, []);

  useEffect(() => {
    loadClientData();
  }, [client_id]);

  const handleEditToggle = async () => {
    if (isEditing) {
      setEditedData({
        name: clientData?.name || '',
        location: clientData?.location || '',
        contact_person: clientData?.contact_person || '',
        email: clientData?.email || '',
        phone: clientData?.phone || '',
        notes: clientData?.notes || '',
      });
      setSaveMessage({ type: '', text: '' });
      await loadClientData();
    } 
    else {
      setEditedData(prev => ({
        ...prev,
        name: clientData?.name || prev.name || '',
        location: clientData?.location || prev.location || '',
        contact_person: clientData?.contact_person || prev.contact_person || '',
        email: clientData?.email || prev.email || '',
        phone: clientData?.phone || prev.phone || '',
        notes: clientData?.notes || prev.notes || '',
      }));
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedData(prev => ({ ...prev, [id]: value }));
  };

  const handleAuthMethodToggle = (methodId) => {
    setSelectedAuthMethodIds(prevSelected => {
      if (prevSelected.includes(methodId)) {
        return prevSelected.filter(id => id !== methodId);
      } else {
        return [...prevSelected, methodId];
      }
    });
  };

  const handleLockerToggle = (lockerId) => {
    setAssignedLockerIds(prev => {
      if (prev.includes(lockerId)) {
        return prev.filter(id => id !== lockerId);
      } else {
        return [...prev, lockerId];
      }
    });
  };

const handleSave = async () => {
  if (!client_id) return;
  setSaveLoading(true);
  setSaveMessage({ type: '', text: '' });
  try {
    const { error: clientUpdateError } = await supabase
      .from('clients')
      .update({
        name: editedData.name,
        location: editedData.location,
        contact_person: editedData.contact_person,
        email: editedData.email,
        phone: editedData.phone,
        notes: editedData.notes,
        updated_at: new Date(),
      })
      .eq('id', client_id);

    if (clientUpdateError) throw clientUpdateError;

    let settingsIdToUse = clientSettingsId;
    if (!settingsIdToUse) {
      const { data: upsertedSettingsData, error: upsertSettingsError } = await supabase
        .from('client_locker_settings')
        .upsert({ client_id: client_id }, { onConflict: 'client_id' })
        .select('id')
        .single();

      if (upsertSettingsError) throw upsertSettingsError;
      settingsIdToUse = upsertedSettingsData.id;
      setClientSettingsId(settingsIdToUse);
    }

    const methodsToAdd = selectedAuthMethodIds.filter(id => !initialSelectedAuthMethodIds.includes(id));
    const methodsToRemove = initialSelectedAuthMethodIds.filter(id => !selectedAuthMethodIds.includes(id));

    if (methodsToAdd.length > 0) {
      const recordsToAdd = methodsToAdd.map(methodId => ({
        client_setting_id: settingsIdToUse,
        auth_method_id: methodId
      }));

      const { error: insertAuthError } = await supabase
        .from('client_auth_methods')
        .upsert(recordsToAdd, {
          onConflict: ['client_setting_id', 'auth_method_id'],
          returning: 'minimal'
        });

      if (insertAuthError) throw insertAuthError;
    }

    if (methodsToRemove.length > 0) {
      const { data: recordsToDelete, error: fetchDeleteError } = await supabase
        .from('client_auth_methods')
        .select('id')
        .eq('client_setting_id', settingsIdToUse)
        .in('auth_method_id', methodsToRemove);

      if (fetchDeleteError) throw fetchDeleteError;
      const recordIdsToDelete = recordsToDelete?.map(record => record.id) || [];

      if (recordIdsToDelete.length > 0) {
        const { error: deleteAuthError } = await supabase
          .from('client_auth_methods')
          .delete()
          .in('id', recordIdsToDelete);

        if (deleteAuthError) throw deleteAuthError;
      }
    }

    const lockersToAssign = assignedLockerIds.filter(id => !initialAssignedLockerIds.includes(id));
    const lockersToUnassign = initialAssignedLockerIds.filter(id => !assignedLockerIds.includes(id));

    if (lockersToAssign.length > 0) {
      const { error: assignError } = await supabase
        .from('lockers')
        .update({ client_id: client_id })
        .in('id', lockersToAssign);

      if (assignError) throw assignError;
    }

    if (lockersToUnassign.length > 0) {
      const { error: unassignError } = await supabase
        .from('lockers')
        .update({ client_id: null })
        .in('id', lockersToUnassign);

      if (unassignError) throw unassignError;
    }

    setClientData(prev => ({
      ...prev,
      ...editedData,
      updated_at: new Date().toISOString(),
      auth_methods: selectedAuthMethodIds.map(id => {
        const method = availableAuthMethods.find(m => m.id === id);
        if (method) {
          return {
            technical_name: method.technical_name,
            name: method.name,
            displayKey: method.technical_name && authMethodDisplayMap[method.technical_name]
              ? method.technical_name
              : 'default'
          };
        }
        return null;
      }).filter(Boolean),
      lockers: assignedLockerIds.map(id => {
        const locker = availableLockers.find(l => l.id === id);
        if (locker) {
          return {
            id: locker.id,
            name: locker.name, 
            assigned_at: locker.assigned_at || new Date().toISOString()
          };
        }
        return null;
      }).filter(Boolean)
    }));

    setInitialSelectedAuthMethodIds(selectedAuthMethodIds);
    setInitialAssignedLockerIds(assignedLockerIds);
    setIsEditing(false);
    setSaveMessage({ type: 'success', text: 'Client information and settings updated successfully!' });

  } catch (err) {
    console.error("Error saving client data:", err);
    setSaveMessage({ type: 'error', text: `Failed to save: ${err.message || 'Unknown error'}` });
  } finally {
    setSaveLoading(false);
  }
};

  const getAuthMethodDisplay = (method) => {
    const displayKey = method.displayKey;
    return authMethodDisplayMap[displayKey] || authMethodDisplayMap['default'];
  };

  if (loading) {
    return (
      <QuickStoreLoading message='client information is loading please wait ' />
    );
  }

  if (fetchError) {
    return (
      <div className="p-6">
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="flex items-start space-x-3 p-4">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Client</h3>
              <p className="text-sm text-red-700 mt-1">{fetchError}</p>
              <p className="text-xs text-red-600 mt-2">Please try refreshing the page or contact support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="p-6">
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Client Not Found</h3>
            <p className="text-gray-500 text-center">
              No client data could be found for ID: {client_id}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lockerCount = clientData?.lockers?.length || 0;
  const lockerAssignmentStatus = lockerCount > 0
    ? `${lockerCount} locker${lockerCount > 1 ? 's' : ''} assigned`
    : 'No lockers assigned';

  return (
    <div className="p-1 md:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-orange-500" />
            Client Details
          </h1>
          <p className="text-gray-600">Viewing information for <span className="font-semibold">{clientData?.name || 'N/A'}</span></p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={saveLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleEditToggle}
                variant="outline"
                disabled={saveLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {saveMessage.text && (
        <div className={`p-4 rounded-md ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center">
            {saveMessage.type === 'success' ? <Check className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="text-orange-600" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                  <Input
                    id="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                  <Input
                    id="location"
                    value={editedData.location}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editedData.notes}
                    onChange={handleInputChange}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Created</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.created_at ? new Date(clientData.created_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </div>
            ) : (
              <dl className="space-y-3">
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Name</dt>
                  <dd className="text-sm text-gray-900 font-medium">{clientData.name}</dd>
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Location</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.location || <span className="italic text-gray-400">Not specified</span>}
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Notes</dt>
                  <dd className="text-sm text-gray-900">
                    {clientData.notes || <span className="italic text-gray-400">No notes provided</span>}
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Created</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.created_at ? new Date(clientData.created_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="text-blue-600" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact_person" className="text-sm font-medium text-gray-700">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={editedData.contact_person}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                  <Input
                    id="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Last Updated</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.updated_at ? new Date(clientData.updated_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </div>
            ) : (
              <dl className="space-y-3">
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Contact Person</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.contact_person || <span className="italic text-gray-400">Not specified</span>}
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Email</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.email ? (
                      <a href={`mailto:${clientData.email}`} className="text-blue-600 hover:underline">
                        {clientData.email}
                      </a>
                    ) : (
                      <span className="italic text-gray-400">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Phone</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.phone || <span className="italic text-gray-400">Not provided</span>}
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Last Updated</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {clientData.updated_at ? new Date(clientData.updated_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="text-purple-600" />
              <span>Locker Access Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Authentication Methods
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">Select one or more methods users can use to access lockers for this client.</p>
                  {selectedAuthMethodIds.length > 0 && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-xs font-medium text-blue-800 flex items-center gap-1 mb-2">
                        <Lock className="w-3.5 h-3.5" /> Selected Methods:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAuthMethodIds.map((methodId) => {
                          const method = availableAuthMethods.find(m => m.id === methodId);
                          if (!method) return null;
                          const methodLabel = method.name || method.technical_name || 'Unknown Method';
                          let IconComponent = Shield;
                          const lowerName = (method.technical_name || method.name || '').toLowerCase();
                          if (lowerName.includes('qr')) IconComponent = Package;
                          if (lowerName.includes('code') || lowerName.includes('password')) IconComponent = Lock;
                          if (lowerName.includes('face')) IconComponent = User;
                          if (lowerName.includes('palm')) IconComponent = Hand;
                          if (lowerName.includes('card')) IconComponent = CreditCard;
                          return (
                            <span
                              key={methodId}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                            >
                              <IconComponent className="w-3.5 h-3.5" />
                              {methodLabel}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                    {availableAuthMethods.length > 0 ? (
                      availableAuthMethods.map((method) => {
                        const isSelected = selectedAuthMethodIds.includes(method.id);
                        return (
                          <div key={method.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`auth-method-${method.id}`}
                              checked={isSelected}
                              onCheckedChange={() => handleAuthMethodToggle(method.id)}
                              disabled={saveLoading}
                            />
                            <Label
                              htmlFor={`auth-method-${method.id}`}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}
                            >
                              {method.name || method.technical_name}
                            </Label>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 col-span-2">No authentication methods available.</p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Access Rules</h4>
                  <p className="text-sm text-gray-900">
                    Standard access rules apply based on selected methods.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication Methods</h4>
                  {clientData.auth_methods && clientData.auth_methods.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {clientData.auth_methods.map((method) => {
                        const displayDetails = getAuthMethodDisplay(method);
                        const IconComponent = displayDetails.icon;
                        const label = method.name || displayDetails.label;
                        return (
                          <Badge
                            key={method.technical_name || method.name}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 rounded-full"
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            {label}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No authentication methods configured.</p>
                  )}
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Access Rules</h4>
                  <p className="text-sm text-gray-900">
                    Standard access rules apply based on selected methods.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="text-green-600" />
              <span>Locker Assignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Assign Lockers</h4>
                  <p className="text-xs text-gray-500 mb-2">Select lockers to assign to this client.</p>
                  {availableLockers.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                      {availableLockers.map((locker) => {
                        const isAvailable = !locker.client_id || locker.client_id === client_id;
                        const isAssigned = assignedLockerIds.includes(locker.id);
                        const wasInitiallyAssigned = initialAssignedLockerIds.includes(locker.id);
                        const isDisabled = saveLoading || !isAvailable;
                        return (
                          <div
                            key={locker.id}
                            className={`flex items-center space-x-2 p-2 rounded ${
                              isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                          >
                            <Checkbox
                              id={`locker-${locker.id}`}
                              checked={isAssigned}
                              disabled={isDisabled}
                              onCheckedChange={() => handleLockerToggle(locker.id)}
                            />
                            <Label
                              htmlFor={`locker-${locker.id}`}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                                isDisabled ? 'text-gray-400' : 'text-gray-700'
                              }`}
                            >
                              {locker.name || `Locker ID: ${locker.id.substring(0, 8)}`} 
                              {wasInitiallyAssigned && !isAssigned && (
                                <span className="text-xs text-orange-600 ml-1">(Currently Assigned)</span>
                              )}
                              {!isAvailable && locker.client_id !== client_id && (
                                <span className="text-xs text-red-500 ml-1">(Assigned Elsewhere)</span>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No lockers available in the system.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <p className="text-sm font-medium text-gray-900">{lockerAssignmentStatus}</p>
                </div>
                {lockerCount > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Lockers</h4>
                    <ul className="mt-1 space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                      {clientData.lockers.map((locker) => (
                        <li key={locker.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-100 rounded">
                          <span className="font-medium">{locker.name || `Locker ID: ${locker.id.substring(0, 8)}`}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarClock className="w-3 h-3" />
                            {locker.assigned_at ? new Date(locker.assigned_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientView;
