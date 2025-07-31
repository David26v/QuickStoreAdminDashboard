"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Building2, XCircle, Users, MapPin } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import supabase, { api } from "@/lib/helper";
import { useAlert } from "@/components/providers/AlertProvider";
import ActionModal from "./components/ActionModal";
import FilterRole from "./components/FilterRole";
import { useDialog } from "@/components/providers/DialogProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Department = () => {
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const router = useRouter();

  const handleCreate = () => {
    setEditData(null); 
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setEditData(null); 
  };
  
  const handleFilter = () => setFilterOpen(true);
  const handleFilterClose = () => setFilterOpen(false);

  const { showAlert } = useAlert();
  const { showDelete } = useDialog();
  
 
  const handleDelete = (id) => {
    showDelete({
      title: "Delete Department",
      description:
        "Are you sure you want to delete this department? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from("departments")
            .delete()
            .eq("id", id);
  
          if (error) {
            showAlert(`Failed to delete department: ${error.message}`, "error");
          } 
          else {
            showAlert("Department deleted successfully", "success");
            fetchDepartment();
          }
        } catch (error) {
          console.error("Delete error:", error);
          showAlert("An error occurred while deleting the department", "error");
        }
      },
      onCancel: () => showAlert("Delete cancelled", "info"),
    });
  };

  const handleSuccess = () => {
    showAlert('Successful Creation of Department' ,'sucess')
    fetchDepartment();
    setOpen(false);
  };

  const handleApplyFilter = (value) => {
    console.log("Filter applied:", value);
  };
  
  const ViewPage = (department_id) => {
    router.push(`/admin/department/view-department/${department_id}`);
  };

  const fetchDepartment = async () => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, description")
        .order("name", { ascending: true })
        .limit(10);

      if (error) {
        showAlert(`Error Fetching Departments: ${error.message}`, "error");
        return;
      }

      setDepartment(data || []);
    } catch (err) {
      showAlert(`Error Fetching Departments: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment(); 
  }, []);





  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="rounded-3xl shadow-sm border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  <div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-lg w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <ActionModal
          open={open}
          onClose={handleClose}
          onSuccess={handleSuccess}
          editData={editData}
        />

        <FilterRole
          open={filterOpen}
          onClose={handleFilterClose}
          onApply={handleApplyFilter}
        />

        <div className="mb-8">
          <PageHeader
            title="Departments"
            onCreate={handleCreate}
            onImport={() => console.log("Import clicked")}
            onExport={() => console.log("Export clicked")}
            onFilter={handleFilter}
            showCreate
            showImportExport
            showFilter
          />
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : department.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card
              className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 max-w-md w-full"
              onClick={handleCreate}
            >
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 size={40} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <XCircle size={20} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  No Departments Available
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Get started by creating your first department to organize your workforce and manage organizational structure.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 dark:bg-white/10 rounded-full text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <Building2 size={16} />
                  Click to Create Department
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {department.map((dept, index) => (
              <Card
                key={dept.id}
                className="group rounded-3xl shadow-sm border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02] hover:bg-white dark:hover:bg-gray-900 overflow-hidden h-full flex flex-col max-w-2xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardContent className="relative p-6 flex flex-col h-full">
                  {/* Header with Department Info and Actions */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-shadow duration-300">
                        <Building2 className="text-white" size={20} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 break-words leading-tight">
                        {dept.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed min-h-[2.5rem] flex items-start">
                        {dept.description || "No description available"}
                      </p>
                      {dept.location && (
                        <div className="flex items-center gap-1 mt-2">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {dept.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - View and Delete only */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          ViewPage(dept.id);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110"
                        title="Delete Department"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(dept.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Department Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {dept.employeeCount || 0}
                      </div>
                      <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                        Employees
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {dept.projectCount || 0}
                      </div>
                      <div className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
                        Projects
                      </div>
                    </div>
                  </div>

                  {/* Department Members Section - Flex grow to fill remaining space */}
                  <div className="flex-1 flex flex-col">
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Department Members
                          </span>
                        </div>
                        {dept.members && dept.members.length > 0 && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                            {dept.members.length}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex items-center">
                        {dept.members && dept.members.length > 0 ? (
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex -space-x-2">
                              {dept.members.slice(0, 4).map((user, userIndex) => (
                                <Avatar 
                                  key={userIndex} 
                                  className="w-8 h-8 border-2 border-white dark:border-gray-900 shadow-sm hover:scale-110 transition-transform duration-200 hover:z-10 relative"
                                  title={user.name || "Department Member"}
                                >
                                  <AvatarImage src={user.avatar || `/avatars/${userIndex + 1}.png`} />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold">
                                    {user.name?.[0] || "M"}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            
                            {dept.members.length > 4 && (
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-sm">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                  +{dept.members.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-4 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 w-full">
                            <div className="text-center">
                              <Users size={20} className="text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                No members assigned
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Department Head */}
                    {dept.head && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={dept.head.avatar} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold">
                              {dept.head.name?.[0] || "H"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {dept.head.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Department Head
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Department;