import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  FileSpreadsheet,
  Shield,
  Clock,
  User,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.admin.auditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.entityType?.toLowerCase().includes(q) ||
      log.actorUser?.name?.toLowerCase().includes(q) ||
      log.actorUser?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar role="ADMIN" />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Compliance & Administrative Audit Trail
                </h1>
                <Badge variant="neutral">Tamper-Evident</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Immutable, timestamped event log recording all administrative modifications, exam creations, and job approvals.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              isLoading={loading}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh Logs
            </Button>
          </div>

          {/* Search bar */}
          <Card className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by action (e.g. CREATE_EXAM), actor name, or entity type..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Card>

          {/* Logs Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Actor (Admin / Faculty)</th>
                    <th className="px-4 py-3">Action Type</th>
                    <th className="px-4 py-3">Target Entity</th>
                    <th className="px-4 py-3">Entity Identifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-sans">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-sans">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {log.actorUser?.name || 'System / Auto'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{log.actorUser?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-sans">
                          <Badge variant="neutral" size="sm">
                            {log.entityType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-400 truncate max-w-xs text-[11px]">
                          {log.entityId || '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-sans text-slate-400">
                        No audit records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
