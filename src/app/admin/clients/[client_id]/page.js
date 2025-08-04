// app/client/[client_id]/page.js (or wherever ClientView is located)
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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import supabase from '@/lib/helper';
import QuickStoreLoading from '@/components/ui/QuickStoreLoading';

const ClientView = () => {
  const { client_id } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // --- Map technical names or names to display labels/icons ---
  // This should ideally match the data in your `auth_methods` table
  const authMethodDisplayMap = {
    'qr_code': { label: 'QR Code', icon: Package },
    'password': { label: 'Password', icon: FileText },
    'face_recognition': { label: 'Face Recognition', icon: ScanFace }, // Adjust key if your technical_name is different
    'palm_reader': { label: 'Palm Reader', icon: Hand },              // Adjust key if your technical_name is different
    'card_reader': { label: 'Card Reader', icon: CreditCard },
    // Add other methods as they exist in your auth_methods table
    // Default fallback
    'default': { label: 'Auth Method', icon: Shield }
  };

  useEffect(() => {
    const fetchClientInfo = async () => {
      if (!client_id) {
        console.log("client_id is not available yet.");
        setLoading(false);
        return; // Exit early if no client_id
      }

      setLoading(true);
      setFetchError(null);
      try {
        // --- Fetch client data and locker assignments ---
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
              locker_number,
              assigned_at
            )
          `)
          .eq("id", client_id)
          .single();

        if (clientError) {
           console.error("Supabase error fetching client information:", clientError.message);
           // Handle specific "not found" error if needed (e.g., PGRST116)
           setFetchError(clientError.message);
           setClientData(null);
           return; // Stop execution if client fetch fails
        }

        // --- Fetch authentication methods for the client ---
        let authMethodsList = [];
        // 1. Get the client_locker_settings ID for this client
        const { data: settingsData, error: settingsError } = await supabase
          .from('client_locker_settings')
          .select('id')
          .eq('client_id', client_id)
          .single(); // There should be only one settings record per client

        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 means not found, which is okay initially
             throw settingsError; // Re-throw other errors
        }

        if (settingsData) {
            // 2. If settings exist, get the associated auth method IDs
            const { data: clientAuthMethodsData, error: clientAuthMethodsError } = await supabase
              .from('client_auth_methods')
              .select('auth_method_id')
              .eq('client_setting_id', settingsData.id);

            if (clientAuthMethodsError) throw clientAuthMethodsError;

            // 3. Get the full auth method details for those IDs
            const authMethodIds = clientAuthMethodsData?.map(item => item.auth_method_id) || [];
            if (authMethodIds.length > 0) {
                const { data: authMethodsData, error: authMethodsError } = await supabase
                  .from('auth_methods')
                  .select('technical_name, name') // Select fields needed for display
                  .in('id', authMethodIds)
                  .eq('is_active', true); // Only fetch active methods

                 if (authMethodsError) throw authMethodsError;

                 // Map fetched data to display format
                 authMethodsList = authMethodsData?.map(method => ({
                    technical_name: method.technical_name,
                    name: method.name,
                    // Use technical_name as key for display map lookup, fallback to name, then 'default'
                    displayKey: method.technical_name || method.name || 'default'
                 })) || [];
            }
        }
        // If settingsData is null or no auth methods found, authMethodsList remains empty []

        console.log('Fetched client data:', clientInfo);
        console.log('Fetched auth methods:', authMethodsList);

        // Combine client data with auth methods for state
        setClientData({
            ...clientInfo,
            auth_methods: authMethodsList 
        });

      } catch (err) {
        console.error("Unexpected error fetching client information:", err.message, err);
        setFetchError(err.message || 'An unexpected error occurred.');
        setClientData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
  }, [client_id]); // Re-run effect if client_id changes

  // --- Handle loading and error states ---
  if (loading) {
    return (
     <QuickStoreLoading message='client information is loading please wait '/>
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

  // Ensure clientData is present after loading/error checks
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

  // --- Use updated clientData for the main content ---
  const lockerCount = clientData?.lockers?.length || 0;
  const lockerAssignmentStatus = lockerCount > 0
    ? `${lockerCount} locker${lockerCount > 1 ? 's' : ''} assigned`
    : 'No lockers assigned';

  return (
    <div className="p-1 md:p-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-orange-500" />
            Client Details
          </h1>
          <p className="text-gray-600">Viewing information for <span className="font-semibold">{clientData?.name || 'N/A'}</span></p>
        </div>
        <div className="flex items-center gap-2">
          {/* Action buttons can go here */}
        </div>
      </div>

      {/* Basic & Contact Information Cards - Side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="text-orange-600" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="space-y-3">
              <div className="flex items-start">
                <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Name</dt>
                <dd className="text-sm text-gray-900">{clientData.name}</dd>
              </div>
              <div className="flex items-start">
                <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">Location</dt>
                <dd className="text-sm text-gray-900 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {clientData.location}
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
          </CardContent>
        </Card>
        {/* Contact Information Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="text-blue-600" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Locker & Access Settings Cards - Side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locker Access Settings Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="text-purple-600" />
              <span>Locker Access Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication Methods</h4>
                {/* --- Updated to use fetched auth_methods data --- */}
                {clientData.auth_methods && clientData.auth_methods.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {clientData.auth_methods.map((method) => {
                      // Use the displayKey to lookup in authMethodDisplayMap
                      const displayDetails = authMethodDisplayMap[method.displayKey] || authMethodDisplayMap['default'];
                      const IconComponent = displayDetails.icon;
                      // Prefer name from auth_methods table, fallback to label from map
                      const label = method.name || displayDetails.label;
                      return (
                        <Badge
                          key={method.technical_name || method.name} // Use a unique key
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
          </CardContent>
        </Card>
        {/* Locker Assignment Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="text-green-600" />
              <span>Locker Assignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
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
                        <span className="font-medium">Locker #{locker.locker_number}</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientView;