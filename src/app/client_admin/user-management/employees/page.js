"use client";
import React, { useState, useEffect } from "react";
import supabase, { api } from "@/lib/helper";
import { useAlert } from "@/components/providers/AlertProvider";
import { useDialog } from "@/components/providers/DialogProvider";
import SewerTable from "@/components/ui/ZentryxTable";
import { useRouter } from "next/navigation";
import AddEmployee from "./components/AddEmployeeModal";
import CardList from "./components/CardList";
import { useLoading } from "@/components/providers/LoadingProvider";

const Employees = () => {
  const [employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", plan: "", status: "" });
  const { showAlert } = useAlert();
  const { showDelete } = useDialog();
  const router = useRouter();
  const { show, hide, isLoading } = useLoading();

  const fetchEmployees = async () => {
    show("Fetching employees...");

    try {
      // 1. Fetch employees
      const { data: employees, error: empError } = await supabase.from(
        "employees"
      ).select(`
          id,
          user_id,
          first_name,
          last_name,
          phone,
          date_hired,
          status,
          salary,
          avatar,
          department:department_id (id, name),
          shift:shift_id (id, name),
          role:role_id (id, name)
        `);

      if (empError) throw empError;

      // 2. Fetch all profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select(`id, email, avatar`);

      if (profileError) throw profileError;

      // 3. Combine employees + profiles by user_id
      const formatted = employees.map((emp) => {
        const profile = profiles.find((p) => p.id === emp.user_id);

        return {
          ...emp,
          email: profile?.email || "—",
          avatar: profile?.avatar || null,
          user: {
            name: `${emp.first_name} ${emp.last_name}`,
            email: profile?.email || "—",
            avatar: profile?.avatar || null,
            user_id: emp.id,
          },
          department: emp.department?.name || "—",
          role: emp.role?.name || "—",
          shift: emp.shift?.name || "—",
        };
      });

      setEmployee(formatted);
      console.log("Formatted data:", formatted);
    } catch (error) {
      console.error("Fetch employees error:", error.message);
      setEmployee([]);
    } finally {
      hide();
    }
  };

  const handleDelete = async (employee_id) => {
    showDelete({
      title: "Delete Employee",
      description:
        "Are you sure you want to delete this employee? This action cannot be undone.",
      onConfirm: async () => {
        try {
          // 1. Fetch the employee to get the related user_id
          const { data: employee, error: fetchError } = await supabase
            .from('employees')
            .select('user_id')
            .eq('id', employee_id)
            .single();
  
          if (fetchError || !employee) {
            console.error("Employee fetch error:", fetchError);
            showAlert("❌ Employee not found", "error");
            return;
          }
  
          const userId = employee.user_id;
  
          // 2. Delete from employees table
          const { error: empError } = await supabase
            .from('employees')
            .delete()
            .eq('id', employee_id);
  
          if (empError) {
            console.error("Delete from employees table failed:", empError);
            showAlert("❌ Failed to delete employee record", "error");
            return;
          }
  
          // 3. Delete from profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
  
          if (profileError) {
            console.error("Delete from profiles table failed:", profileError);
            showAlert("⚠️ Deleted employee but failed to remove profile", "warning");
          }
  
          // 4. (Optional) Delete from Supabase Auth
          const { error: authError } = await supabase.auth.admin.deleteUser(userId);
          if (authError) {
            console.error("Auth user deletion failed:", authError);
            showAlert("⚠️ Profile deleted, but failed to remove auth user", "warning");
          }
  
          // 5. Update local state and show success
          setEmployee((prev) => prev.filter((e) => e.id !== employee_id));
          showAlert("✅ Employee deleted successfully", "success");
          fetchUsers();
  
        } catch (error) {
          console.error("Unexpected error during deletion:", error);
          showAlert("❌ Failed to delete employee", "error");
        }
      },
      onCancel: () => showAlert("❎ Deletion cancelled", "info"),
    });
  };

  const filteredData = employee.filter((e) => {
    const fullName = `${e.first_name} ${e.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesRole = filters.role ? e.position === filters.role : true;
    const matchesStatus =
      filters.status && filters.status !== "all"
        ? e.status === filters.status
        : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    { key: "user", name: "Full Name" },
    { key: "department", name: "Department" },
    { key: "role", name: "Role" },
    { key: "date_hired", name: "Date Hired" },
    { key: "shift", name: "Shift" },
    { key: "salary", name: "Salary" },
    { key: "status", name: "Status" },
  ];

  const tableData = filteredData.map((employee) => ({
    user: {
      name: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      avatar: employee.avatar,
      user_id: employee.id,
    },
    department: employee.department,
    role: employee.role,
    date_hired: new Date(employee.date_hired).toLocaleDateString(),
    salary: `₱${employee.salary.toLocaleString()}`,
    status: employee.status ? "Active" : "Inactive",
  }));


  useEffect(() => {
    fetchEmployees();
  }, []);

  const filterOptions = [
    {
      key: "role",
      label: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Viewer", value: "viewer" },
      ],
    },

    {
      key: "status",
      label: "Status",
      options: [
        { label: "all", value: "all" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Pending", value: "Pending" },
      ],
    },
  ];

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="">
      <CardList employeeData={employee} />

      <SewerTable
        data={tableData}
        columns={columns}
        filters={filterOptions}
        search={search}
        onSearch={setSearch}
        onFilterChange={handleFilterChange}
        loading={isLoading}
        ButtonPlacement={<AddEmployee fetchEmployees={fetchEmployees} />}
        onDelete={handleDelete}
        onView={(item) => {
          router.push(`/admin/employees/${item.user.user_id}`);
        }}
      />
    </div>
  );
};

export default Employees;
