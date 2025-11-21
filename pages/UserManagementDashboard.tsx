
import React, { useState } from 'react';
import { Card } from '../components/Card';
import type { UserAccount, UserRole, UserManagementEvent } from '../types';
import { ShieldCheckIcon, LockClosedIcon, UsersIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// --- MOCK DATA ---
const initialRoles: UserRole[] = [
    { 
        id: 'role-boc', 
        name: 'Contact Center Officer', 
        description: 'Operational support for airline queries and boarding status.', 
        permissions: ['search_travelers', 'view_boarding_directives', 'resolve_airline_queries'] 
    },
    { 
        id: 'role-analyst', 
        name: 'Security Analyst', 
        description: 'High-level intelligence role for vetting and investigation.', 
        permissions: ['view_referrals', 'qualify_referrals', 'view_sensitive_hits', 'escalate_to_alert', 'promote_to_case'] 
    },
    { 
        id: 'role-alert-officer', 
        name: 'Alerts Officer', 
        description: 'Tactical intervention team member at a specific port.', 
        permissions: ['view_assigned_alerts', 'log_intervention_outcome'] 
    },
    { 
        id: 'role-watchlist-admin', 
        name: 'Watch List Administrator', 
        description: 'Trusted management of high-risk targets.', 
        permissions: ['manage_watchlist_add', 'manage_watchlist_edit', 'manage_watchlist_delete'] 
    },
    { 
        id: 'role-auditor', 
        name: 'Auditor', 
        description: 'Compliance and oversight role.', 
        permissions: ['view_audit_logs', 'search_audit_history'] 
    },
    { 
        id: 'role-routes-admin', 
        name: 'Routes Administrator', 
        description: 'Optimization of system performance and profiling rules.', 
        permissions: ['access_profiler', 'manage_route_profiles'] 
    },
];

const initialUsers: UserAccount[] = [
    { id: 'user-01', name: 'Sgt. Alif (BOC)', email: 'alif@boc.gov.my', roleId: 'role-boc', status: 'Active', lastLogin: '2023-10-28 10:00:15' },
    { id: 'user-02', name: 'Analyst Sarah', email: 'sarah@intel.gov.my', roleId: 'role-analyst', status: 'Active', lastLogin: '2023-10-28 11:30:00' },
    { id: 'user-03', name: 'Officer Tan (KUL)', email: 'tan@airport.gov.my', roleId: 'role-alert-officer', status: 'Active', lastLogin: '2023-10-28 11:45:22' },
    { id: 'user-04', name: 'Director Lee', email: 'lee@admin.gov.my', roleId: 'role-watchlist-admin', status: 'Active', lastLogin: '2023-10-25 09:00:00' },
    { id: 'user-05', name: 'Audit Firm Ext', email: 'audit@external.com', roleId: 'role-auditor', status: 'Active', lastLogin: '2023-10-27 16:00:00' },
];

const initialActivity: UserManagementEvent[] = [
    { id: 'evt-1', timestamp: '2023-10-28 09:05:00', adminUser: 'SysAdmin', action: 'ROLE_UPDATE', details: "Enforced 'No PII' restriction on Auditor role." },
    { id: 'evt-2', timestamp: '2023-10-28 08:30:10', adminUser: 'SysAdmin', action: 'USER_CREATE', details: "Provisioned new Alerts Officer account for KUL terminal." },
];

// --- UI COMPONENTS ---
const UserStatusPill: React.FC<{ status: UserAccount['status'] }> = ({ status }) => {
    const styles = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-200 text-gray-800',
        Locked: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const PermissionCheck: React.FC<{ allowed: boolean }> = ({ allowed }) => (
    allowed ? 
    <div className="flex justify-center"><div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div></div> : 
    <div className="flex justify-center"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div></div>
);

const UserEditorModal: React.FC<{
    user: Partial<UserAccount> | null;
    roles: UserRole[];
    onClose: () => void;
    onSave: (user: UserAccount) => void;
}> = ({ user, roles, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<UserAccount>>(user || {
        status: 'Active',
        roleId: roles[0].id
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalUser: UserAccount = {
            id: formData.id || `user-${Date.now()}`,
            name: formData.name || '',
            email: formData.email || '',
            roleId: formData.roleId || roles[0].id,
            status: (formData.status as UserAccount['status']) || 'Active',
            lastLogin: formData.lastLogin || 'Never',
        };
        onSave(finalUser);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <Card title={user?.id ? 'Edit User' : 'Create New User'} className="w-full max-w-md animate-scale-in">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="roleId" value={formData.roleId} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-white">
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-white">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Locked">Locked</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-secondary text-white rounded hover:bg-brand-primary">Save User</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export const UserManagementDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserAccount[]>(initialUsers);
    const [roles] = useState<UserRole[]>(initialRoles);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRoles[0]);
    
    // Modal State
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

    // Explicit Policy Definitions for the UI
    const rolePolicies: Record<string, { allowed: string[], denied: string[] }> = {
        'role-boc': {
            allowed: ['Search Travelers', 'View Boarding Directive', 'Resolve Airline Queries'],
            denied: ['View Sensitive "Hit Details"', 'View Intelligence Reports', 'Override Watchlist']
        },
        'role-analyst': {
            allowed: ['View All Referrals', 'View Full Hit Details', 'Escalate to Alert', 'Promote to Case'],
            denied: ['Direct Watchlist Modification (Admin only)', 'System Configuration']
        },
        'role-alert-officer': {
            allowed: ['View Assigned Airport Alerts', 'Log Intervention Outcomes'],
            denied: ['View Global Referrals', 'View Long-term Cases', 'Search Non-Alerted Travelers']
        },
        'role-watchlist-admin': {
            allowed: ['Add/Edit/Delete Targets', 'Manage List Priority'],
            denied: ['View Operational Dashboards', 'Process Live Travelers']
        },
        'role-auditor': {
            allowed: ['View Audit Logs', 'Search Compliance History'],
            denied: ['View Traveler PII', 'Execute System Actions', 'Modify Data']
        },
        'role-routes-admin': {
            allowed: ['Access Profiler', 'Manage Route Rules'],
            denied: ['View Individual Traveler Records', 'Access Watchlist']
        }
    };

    const handleToggleStatus = (userId: string) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userId) {
                return { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return user;
        }));
    };
    
    const handleSaveUser = (user: UserAccount) => {
        if (editingUser) {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        } else {
            setUsers(prev => [user, ...prev]);
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    return (
        <div className="space-y-6">
            {isUserModalOpen && (
                <UserEditorModal 
                    user={editingUser} 
                    roles={roles} 
                    onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }} 
                    onSave={handleSaveUser} 
                />
            )}

            <Card className="bg-slate-800 text-white border-l-4 border-brand-secondary">
                <div className="flex items-center">
                    <ShieldCheckIcon className="h-8 w-8 text-brand-secondary mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold">Access Control & Security (RBAC)</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Enforcing "Need to Know" and "Separation of Duties" through granular role definitions.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Defined Roles">
                        <div className="space-y-2">
                            {roles.map(role => (
                                <div 
                                    key={role.id} 
                                    onClick={() => setSelectedRole(role)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedRole?.id === role.id ? 'bg-blue-50 border-brand-secondary ring-1 ring-brand-secondary' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="font-bold text-brand-dark">{role.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{role.description}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    {selectedRole && (
                        <Card title={
                            <div className="flex items-center">
                                <LockClosedIcon className="h-6 w-6 mr-2 text-brand-primary" />
                                Policy Definition: {selectedRole.name}
                            </div>
                        }>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="font-bold text-green-800 flex items-center mb-3">
                                        <UsersIcon className="h-4 w-4 mr-2" />
                                        Granted Capabilities
                                    </h4>
                                    <ul className="space-y-2">
                                        {rolePolicies[selectedRole.id].allowed.map((perm, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-green-900">
                                                <span className="mr-2 text-green-500">✓</span>
                                                {perm}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <h4 className="font-bold text-red-800 flex items-center mb-3">
                                        <EyeSlashIcon className="h-4 w-4 mr-2" />
                                        Explicit Restrictions
                                    </h4>
                                    <ul className="space-y-2">
                                        {rolePolicies[selectedRole.id].denied.map((perm, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-red-900">
                                                <span className="mr-2 text-red-500">✕</span>
                                                {perm}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 mb-4">Permission Matrix</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500">
                                                <th className="p-2 border text-left">Capability</th>
                                                <th className="p-2 border text-center w-20">Search</th>
                                                <th className="p-2 border text-center w-20">Hits</th>
                                                <th className="p-2 border text-center w-20">Cases</th>
                                                <th className="p-2 border text-center w-20">Admin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-2 border font-medium">{selectedRole.name}</td>
                                                <td className="p-2 border bg-gray-50">
                                                    <PermissionCheck allowed={selectedRole.permissions.some(p => p.includes('search') || p.includes('view_referrals'))} />
                                                </td>
                                                <td className="p-2 border bg-gray-50">
                                                    <PermissionCheck allowed={selectedRole.permissions.includes('view_sensitive_hits')} />
                                                </td>
                                                <td className="p-2 border bg-gray-50">
                                                    <PermissionCheck allowed={selectedRole.permissions.includes('promote_to_case')} />
                                                </td>
                                                <td className="p-2 border bg-gray-50">
                                                    <PermissionCheck allowed={selectedRole.permissions.some(p => p.includes('manage') || p.includes('admin'))} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Card title={
                <div className="flex justify-between items-center">
                    <span>Active User Assignments</span>
                    <button 
                        onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                        className="px-3 py-1.5 bg-brand-secondary text-white text-sm font-bold rounded hover:bg-brand-primary transition-colors flex items-center"
                    >
                        <span className="text-lg mr-1">+</span> Add User
                    </button>
                </div>
            }>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-medium">
                                            {roles.find(r => r.id === user.roleId)?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><UserStatusPill status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{user.lastLogin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <button onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }} className="text-brand-secondary hover:text-brand-primary">Edit</button>
                                        <button onClick={() => handleToggleStatus(user.id)} className="text-amber-600 hover:text-amber-800">Toggle Status</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
