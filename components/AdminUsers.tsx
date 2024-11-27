
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // Adjust the path as necessary
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm('Opravdu chcete smazat vybrané uživatele?')) {
      const deletePromises = selectedUsers.map((userId) =>
        deleteUser(userId)
      );
      await Promise.all(deletePromises);
      setSelectedUsers([]);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const deleteUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="px-4 mt-16 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Uživatelé</h1>
        </div>
        <div className="sm:flex sm:items-center sm:ml-4">
          <button
            onClick={handleBulkDelete}
            className="mr-2 p-2 bg-red-600 text-white rounded"
          >
            Smazat vybrané
          </button>
        </div>
      </div>
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">Jméno</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-blue-500">Email</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Telefon</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Akce</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{user.phone}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/user/edit/${user.id}`} className="text-blue-600 hover:text-blue-900 ml-2">Upravit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;