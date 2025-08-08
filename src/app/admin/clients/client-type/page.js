"use client";
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Grid3X3, 
  List, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  MoreVertical,
  Shield,
  Lock,
  Users,
  Crown,
  UserCheck,
  Star
} from 'lucide-react';
import supabase from "@/lib/helper";
import { Input, SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';
import { useRouter } from 'next/navigation';
import AddClientTypeModal from '../components/AddClientTypeModal';

const ClientTypePage = () => {
  const [clientTypes, setClientTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientTypes, setFilteredClientTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingClientType, setEditingClientType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchClientTypes();
  }, []);

  useEffect(() => {
    const filtered = clientTypes.filter(clientType =>
      clientType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (clientType.description && clientType.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredClientTypes(filtered);
  }, [clientTypes, searchTerm]);

  const fetchClientTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_types')
        .select(`
          *,
          clients(count)
        `)
        .order('created_at', { ascending: false });


      if (error) {
        console.error('Error fetching client types:', error);
        return;
      }

      setClientTypes(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
const handleAction = (action, clientType) => {
    console.log(`${action} action for client type:`, clientType);
    if (action === 'edit') {
      setEditingClientType(clientType);
      setOpenModal(true);
    }
    if (action === 'view') {
      router.push(`/admin/clients/client-type/${clientType.id}`);
    }
    if (action === 'delete') {

    
      
    }
 
  };

  const getClientTypeIcon = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('premium') || lowerName.includes('elite') || lowerName.includes('vip')) {
      return Crown;
    } else if (lowerName.includes('enterprise') || lowerName.includes('corporate')) {
      return Building2;
    } else if (lowerName.includes('professional') || lowerName.includes('pro')) {
      return UserCheck;
    } else if (lowerName.includes('standard') || lowerName.includes('basic')) {
      return Users;
    } else if (lowerName.includes('developer') || lowerName.includes('tech')) {
      return Shield;
    } else {
      return Star;
    }
  };

  // Color scheme mapping for different client types
  const getClientTypeColors = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('premium') || lowerName.includes('elite') || lowerName.includes('vip')) {
      return 'from-orange-600 to-orange-700';
    } else if (lowerName.includes('enterprise') || lowerName.includes('corporate')) {
      return 'from-gray-600 to-gray-700';
    } else if (lowerName.includes('professional') || lowerName.includes('pro')) {
      return 'from-orange-500 to-orange-600';
    } else {
      return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <QuickStoreLoadingCompact message='Client Types Loading...' />
    );
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFetchAddedClientType = () => {
    fetchClientTypes();
  };

 

  return (
    <>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Client Type Management</h1>
                <p className="text-gray-600">Manage your client type categories and settings</p>
              </div>
            </div>
            <Button 
              onClick={handleOpenModal}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Client Type</span>
            </Button>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <SearchInput
                  type="text"
                  placeholder="Search client types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* View Toggle and Actions */}
              <div className="flex items-center space-x-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'table' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'card' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                </div>
                <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Types</p>
                    <p className="text-2xl font-bold text-blue-800">{clientTypes.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active Clients</p>
                    <p className="text-2xl font-bold text-green-800">
                      {clientTypes.reduce((sum, type) => sum + (type.clients?.[0]?.count || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Most Popular</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {clientTypes.length > 0 
                        ? clientTypes.reduce((prev, current) => 
                            (prev.clients?.[0]?.count || 0) > (current.clients?.[0]?.count || 0) ? prev : current
                          ).name.substring(0, 10) + '...'
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {viewMode === 'table' ? (
              // Table View
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Clients</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Created</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredClientTypes.map((clientType) => {
                      const IconComponent = getClientTypeIcon(clientType.name);
                      const colorGradient = getClientTypeColors(clientType.name);
                      
                      return (
                        <tr key={clientType.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${colorGradient} rounded-lg flex items-center justify-center`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{clientType.name}</p>
                                <p className="text-sm text-gray-500">ID: {clientType.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-700">
                              {clientType.description || 'No description available'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {clientType.clients?.[0]?.count || 0} clients
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{formatDate(clientType.created_at)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                onClick={() => handleAction('view', clientType)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAction('edit', clientType)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAction('delete', clientType)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              // Card View
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClientTypes.map((clientType) => {
                    const IconComponent = getClientTypeIcon(clientType.name);
                    const colorGradient = getClientTypeColors(clientType.name);
                    
                    return (
                      <div key={clientType.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${colorGradient} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-lg">{clientType.name}</h3>
                              <p className="text-sm text-gray-500">ID: {clientType.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                          <div className="relative">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {clientType.description || 'No description provided for this client type.'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 text-sm">{clientType.clients?.[0]?.count || 0} clients using this type</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 text-sm">Created {formatDate(clientType.created_at)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => handleAction('view', clientType)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button 
                            onClick={() => handleAction('edit', clientType)}
                            className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-150 flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredClientTypes.length === 0 && !loading && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No client types found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client type'}
                </p>
                {!searchTerm && (
                  <button 
                    onClick={handleOpenModal}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Client Type</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals would go here - similar to AddClientModal */}
      
     <AddClientTypeModal 
        isOpen={openModal}
        onClose={handleCloseModal}
        onClientTypeAdded={handleFetchAddedClientType}
        editClientType={editingClientType}
      /> 
     
    </>
  );
};

export default ClientTypePage;