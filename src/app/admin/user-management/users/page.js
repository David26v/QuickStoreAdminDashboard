"use client";
import React, { useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import supabase from "@/lib/helper";
import { useAlert } from "@/components/providers/AlertProvider";
import { useDialog } from "@/components/providers/DialogProvider";
import SewerTable from "@/components/ui/ZentryxTable";
import { useRouter } from "next/navigation";
import CardList from "./CardList";
import ZentryxTable from "@/components/ui/ZentryxTable";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: "", plan: "", status: "" });
  const { showAlert } = useAlert();
  const { showDelete } = useDialog();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          email,
          avatar,
          role,
          shift:shift_id (
            id,
            name
          )
      `);

        console.log('data',data)
  
      if (error) {
        console.error("Supabase error fetching users:", error.message);
        setUsers([]);
        return;
      }
  
      if (Array.isArray(data)) {
        setUsers(data);
      } 
      else {
        console.error("Fetched users is not an array.");
        setUsers([]);
      }
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (user_id) => {
    showDelete({
      title: "Delete User",
      description:
        "Are you sure it will be deleted to our system but you can create another one ?",
      onConfirm: async () => {
        try {
          await api("/api/users/delete-account", "DELETE", { user_id });
          setUsers((prev) => prev.filter((u) => u._id !== user_id));
          showAlert("User deleted", "success");
          fetchUsers();
        } catch (error) {
          showAlert("Failed to delete user", "error");
        }
      },
      onCancel: () => showAlert("Cancelled", "info"),
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filters.role ? u.role === filters.role : true;
    const matchesStatus = filters.status ? u.status === filters.status : true;
    return matchesSearch && matchesRole  && matchesStatus;
  });
  const columns = [
    { key: "user", name: "Full Name" },
    { key: "role", name: "ROLE" },
    { key: "shift", name: "SHIFT" }, 
    { key: "status", name: "STATUS" },
  ];
  
  const tableData = filteredUsers.map((u) => ({
    user: {
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
      avatar: u.avatar,
      user_id: u.id,
    },
    role: u.role,
    status: u.status ?? "Active", 
    shift: u.shift?.name ?? "No Shift", 
  }));

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
      key: "plan",
      label: "Plan",
      options: [
        { label: "Enterprise", value: "Enterprise" },
        { label: "Basic", value: "Basic" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
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
      <CardList  userList = {users}/>

      <ZentryxTable
        data={tableData}
        columns={columns}
        filters={filterOptions}
        search={search}
        onSearch={setSearch}
        onFilterChange={handleFilterChange}
        loading={loading}
        ButtonPlacement={<AddUserModal fetchUser = {fetchUsers} />}
        onDelete={handleDelete}
        onView={(item) => {
          router.push(`/admin/user-management/users/${item.user.user_id}`);
        }}
      />
    </div>
  );
};

export default UserPage;
