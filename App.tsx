
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login'; // Import Login Page
import { ASOCDashboard } from './pages/ASOCDashboard';
import { RiskAnalyticsDashboard } from './pages/RiskAnalyticsDashboard';
import { DataIngestionDashboard } from './pages/DataIngestionDashboard';
import { XAIAuditDashboard } from './pages/XAIAuditDashboard';
import { APIGatewayDashboard } from './pages/APIGatewayDashboard';
import { PNRGatewayDashboard } from './pages/PNRGatewayDashboard';
import { TravelerModuleDashboard } from './pages/TravelerModuleDashboard';
import { IndividualTravelerRecordView } from './pages/IndividualTravelerRecordView';
import { GovernmentGatewayDashboard } from './pages/GovernmentGatewayDashboard';
import { CarrierPortalDashboard } from './pages/CarrierPortalDashboard';
import { ApplicationProcessorDashboard } from './pages/ApplicationProcessorDashboard';
import { BorderOperationsCenterDashboard } from './pages/BorderOperationsCenterDashboard';
import { DataAcquisitionDashboard } from './pages/DataAcquisitionDashboard';
import { TravelerDatabaseDashboard } from './pages/TravelerDatabaseDashboard';
import { UserManagementDashboard } from './pages/UserManagementDashboard';
import { AdvancedSearchDashboard } from './pages/AdvancedSearchDashboard';
import { RiskManagerDashboard } from './pages/RiskManagerDashboard';
import { RiskBrokerDashboard } from './pages/RiskBrokerDashboard';
import { WatchListManagerDashboard } from './pages/WatchListManagerDashboard';
import { IdentityResolutionDashboard } from './pages/IdentityResolutionDashboard';
import { ProfilerDashboard } from './pages/ProfilerDashboard';
import { CaseManagementDashboard } from './pages/CaseManagementDashboard';
import { LinkAnalysisDashboard } from './pages/LinkAnalysisDashboard';
import { FlightStatusDashboard } from './pages/FlightStatusDashboard';
import { SecondaryScreeningDashboard } from './pages/SecondaryScreeningDashboard';
import { BiometricCorridorDashboard } from './pages/BiometricCorridorDashboard';
import { PatternAnalysisDashboard } from './pages/PatternAnalysisDashboard';
import { OverstayTrackingDashboard } from './pages/OverstayTrackingDashboard';
import { ReportingDashboard } from './pages/ReportingDashboard';
import { BoardingRulesDashboard } from './pages/BoardingRulesDashboard';
import { AuditLogsDashboard } from './pages/AuditLogsDashboard';
import { SystemHealthDashboard } from './pages/SystemHealthDashboard';
import { SystemConfigurationDashboard } from './pages/SystemConfigurationDashboard';
import { ETADashboard } from './pages/ETADashboard';
import { ETATravelerPortal } from './pages/ETATravelerPortal';

// Authentication Helper Component
const RequireAuth = ({ children }: { children: React.JSX.Element }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('mapss_token'); // Simple token check

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Navigate to="/command-control/asoc" replace />} />
          <Route path="/command-control/asoc" element={<ASOCDashboard />} />
          <Route path="/command-control/xai-audit" element={<XAIAuditDashboard />} />
          <Route path="/command-control/flight-status" element={<FlightStatusDashboard />} />
          
          {/* Updated Route Group */}
          <Route path="/data-intelligence/advanced-search" element={<AdvancedSearchDashboard />} />
          <Route path="/data-intelligence/link-analysis" element={<LinkAnalysisDashboard />} />
          <Route path="/data-intelligence/case-management" element={<CaseManagementDashboard />} />
          <Route path="/data-intelligence/traveler-module" element={<TravelerModuleDashboard />} />
          <Route path="/data-intelligence/traveler/:puid" element={<IndividualTravelerRecordView />} />
          <Route path="/data-intelligence/risk-analytics" element={<RiskAnalyticsDashboard />} />
          <Route path="/data-intelligence/risk-manager" element={<RiskManagerDashboard />} />
          <Route path="/data-intelligence/risk-broker" element={<RiskBrokerDashboard />} />
          <Route path="/data-intelligence/profiler" element={<ProfilerDashboard />} />
          <Route path="/data-intelligence/watchlist-manager" element={<WatchListManagerDashboard />} />
          <Route path="/data-intelligence/identity-resolution" element={<IdentityResolutionDashboard />} />
          <Route path="/data-intelligence/data-ingestion" element={<DataIngestionDashboard />} />
          <Route path="/data-intelligence/das" element={<DataAcquisitionDashboard />} />
          <Route path="/data-intelligence/traveler-database" element={<TravelerDatabaseDashboard />} />
          <Route path="/data-intelligence/api-gateway" element={<APIGatewayDashboard />} />
          <Route path="/data-intelligence/pnr-gateway" element={<PNRGatewayDashboard />} />
          <Route path="/data-intelligence/government-gateway" element={<GovernmentGatewayDashboard />} />
          <Route path="/data-intelligence/carrier-portal" element={<CarrierPortalDashboard />} />
          <Route path="/data-intelligence/eta" element={<ETADashboard />} />
          <Route path="/data-intelligence/eta-portal" element={<ETATravelerPortal />} />

          <Route path="/at-airport/application-processor" element={<ApplicationProcessorDashboard />} />
          <Route path="/at-airport/boc" element={<BorderOperationsCenterDashboard />} />
          <Route path="/at-airport/secondary-screening" element={<SecondaryScreeningDashboard />} />
          <Route path="/at-airport/biometric-corridor" element={<BiometricCorridorDashboard />} />
          <Route path="/post-travel/pattern-analysis" element={<PatternAnalysisDashboard />} />
          <Route path="/post-travel/overstay-tracking" element={<OverstayTrackingDashboard />} />
          <Route path="/post-travel/reporting" element={<ReportingDashboard />} />
          
          <Route path="/admin/boarding-rules" element={<BoardingRulesDashboard />} />
          <Route path="/admin/user-management" element={<UserManagementDashboard />} />
          <Route path="/admin/system-health" element={<SystemHealthDashboard />} />
          <Route path="/admin/audit-logs" element={<AuditLogsDashboard />} />
          <Route path="/admin/configuration" element={<SystemConfigurationDashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;