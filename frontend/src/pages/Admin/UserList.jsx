import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error || "Failed to delete user");
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setEditableUserName("");
    setEditableUserEmail("");
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update user");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <AdminMenu/>
          <table className="w-full md:w-[70rem] mx-auto min-w-[600px] border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left border">ID</th>
                <th className="px-4 py-2 text-left border">Name</th>
                <th className="px-4 py-2 text-left border">Email</th>
                <th className="px-4 py-2 text-center border">Admin</th>
                <th className="px-4 py-2 text-center border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
                editableUserId === user._id ? (
                  <tr key={`edit-${user._id}`} className="bg-yellow-100">
                    <td className="px-4 py-2 border">{user._id}</td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="email"
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </td>
                    <td className="px-4 py-2 text-center border">
                      {user.isAdmin ? (
                        <FaCheck
                          className="text-green-500 mx-auto"
                          title="Admin"
                        />
                      ) : (
                        <FaTimes
                          className="text-red-500 mx-auto"
                          title="Not admin"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border flex justify-center space-x-2">
                      <button
                        onClick={() => updateHandler(user._id)}
                        disabled={isUpdating}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                        title="Save"
                      >
                        {isUpdating ? <Spinner size="sm" /> : <FaCheck />}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isUpdating}
                        className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded disabled:opacity-50"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{user._id}</td>
                    <td className="px-4 py-3 border flex justify-between items-center">
                      {user.username}
                      <button
                        onClick={() =>
                          toggleEdit(user._id, user.username, user.email)
                        }
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td className="px-4 py-2 border">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-center border">
                      {user.isAdmin ? (
                        <FaCheck
                          className="text-green-500 mx-auto"
                          title="Admin"
                        />
                      ) : (
                        <FaTimes
                          className="text-red-500 mx-auto"
                          title="Not admin"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded disabled:opacity-50"
                          title="Delete user"
                        >
                          {isDeleting ? <Spinner size="sm" /> : <FaTrash />}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
