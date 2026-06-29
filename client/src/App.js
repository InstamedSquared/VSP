import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import usePageTitle from './hooks/usePageTitle';
import Modal from './components/layout/Modal';

import ProtectedRoute from './components/auth/ProtectedRoute';
import WebLayout from './components/layout/WebLayout';
// import CMSLayout from './components/layout/CMSLayout';

// Web Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import EmailTest from './pages/auth/EmailTest';

// Employee LMS
const CourseLessons = lazy(() => import('./pages/employee/lms/CourseLessons'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const ClientLayout = lazy(() => import('./components/layout/ClientLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/Users'));
const Employees = lazy(() => import('./pages/admin/Employees'));
const Profile = lazy(() => import('./pages/admin/Profile'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const Placeholder = lazy(() => import('./pages/admin/Placeholder'));
const Pending = lazy(() => import('./pages/admin/Pending'));
const BenchStatus = lazy(() => import('./pages/admin/workforce/BenchStatus'));
const Skills = lazy(() => import('./pages/admin/workforce/Skills'));
const AdminDocuments = lazy(() => import('./pages/admin/workforce/Documents'));
const Payslips = lazy(() => import('./pages/admin/workforce/Payslips'));
const Applicants = lazy(() => import('./pages/admin/recruitment/Applicants'));
const Pipeline = lazy(() => import('./pages/admin/recruitment/Pipeline'));
const JobPostings = lazy(() => import('./pages/admin/recruitment/JobPostings'));
const Clients = lazy(() => import('./pages/admin/operations/Clients'));
const ClientRequests = lazy(() => import('./pages/admin/operations/ClientRequests'));
const Assignments = lazy(() => import('./pages/admin/operations/Assignments'));
const Compliance = lazy(() => import('./pages/admin/operations/Compliance'));
const Announcements = lazy(() => import('./pages/admin/operations/Announcements'));
const Invoices = lazy(() => import('./pages/admin/finance/Invoices'));
const InvoiceDetails = lazy(() => import('./pages/admin/finance/InvoiceDetails'));
const Payroll = lazy(() => import('./pages/admin/finance/Payroll'));
const Courses = lazy(() => import('./pages/admin/lms/Courses'));
const CourseModules = lazy(() => import('./pages/admin/lms/CourseModules'));

const MyCourses = lazy(() => import('./pages/employee/lms/MyCourses'));
const MyProgress = lazy(() => import('./pages/employee/lms/Progress'));
const MyPayslips = lazy(() => import('./pages/employee/hr/MyPayslips'));
const Leaves = lazy(() => import('./pages/employee/hr/Leaves'));
const MyDocuments = lazy(() => import('./pages/employee/hr/MyDocuments'));
const EmpDashboard = lazy(() => import('./pages/employee/Dashboard'));

// Client Portal Pages
const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const MyTeam = lazy(() => import('./pages/client/workforce/MyTeam'));
const ClientSkills = lazy(() => import('./pages/client/workforce/Skills'));
const Replacements = lazy(() => import('./pages/client/recruitment/Replacements'));
const LeaveApprovals = lazy(() => import('./pages/client/workforce/LeaveApprovals'));
const ClientInvoices = lazy(() => import('./pages/client/billing/ClientInvoices'));
const ClientPayments = lazy(() => import('./pages/client/billing/ClientPayments'));
const TrainingMaterials = lazy(() => import('./pages/client/training/TrainingMaterials'));
const Contracts = lazy(() => import('./pages/client/training/Contracts'));


const CMSLayout = lazy(() => import('./components/layout/CMSLayout'));
// const DashboardCms = lazy(() => import('./pages/cms/Dashboard'));
// const ConsoleEditor = lazy(() => import('./pages/cms/Editor'));
const Hire = lazy(() => import('./pages/web/Hire'));
const CmsPage = lazy(() => import('./pages/web/CmsPage'));
const Careers = lazy(() => import('./pages/web/Careers'));

const PageTitleManager = () => { usePageTitle(); return null; };
const FullPageSpinner = () => (
    <div className='page-loading-case'>
        <div className='page-loading'>
            <div className='loader-line-scale'><div></div><div></div><div></div><div></div><div></div></div>
            <h3>Loading Page...</h3>
        </div>
    </div>
);

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PageTitleManager />
            <Suspense fallback={<FullPageSpinner />}>
                <Routes>
                    <Route element={<WebLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/verify-otp" element={<VerifyOtp />} />
                        <Route path="/email-test" element={<EmailTest />} />

                        <Route path="/" element={<CmsPage />} />
                        <Route path="/about" element={<CmsPage />} />
                        <Route path="/contact" element={<CmsPage />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/hire" element={<Hire />} />
                        <Route path="/p/:slug" element={<CmsPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="users" element={<Users />} />
                            <Route path="employees" element={<Employees />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="pending" element={<Pending />} />
                            {/* VSP Modules */}
                            <Route path="workforce">
                                <Route path="bench" element={<BenchStatus />} />
                                <Route path="skills" element={<Skills />} />
                                <Route path="documents" element={<AdminDocuments />} />
                                <Route path="payslips" element={<Payslips />} />
                            </Route>
                            <Route path="workforce/*" element={<Placeholder />} />
                            <Route path="recruitment/applicants" element={<Applicants />} />
                            <Route path="recruitment/pipeline" element={<Pipeline />} />
                            <Route path="recruitment/jobs" element={<JobPostings />} />
                            <Route path="recruitment/*" element={<Placeholder />} />
                            <Route path="operations/clients" element={<Clients />} />
                            <Route path="operations/client-requests" element={<ClientRequests />} />
                            <Route path="operations/assignments" element={<Assignments />} />
                            <Route path="operations/compliance" element={<Compliance />} />
                            <Route path="operations/announcements" element={<Announcements />} />
                            <Route path="operations/*" element={<Placeholder />} />
                            <Route path="finance/invoices" element={<Invoices />} />
                            <Route path="finance/invoices/:id" element={<InvoiceDetails />} />
                            <Route path="finance/payroll" element={<Payroll />} />
                            <Route path="finance/*" element={<Placeholder />} />
                            <Route path="lms/courses" element={<Courses />} />
                            <Route path="lms/courses/:id" element={<CourseModules />} />
                            <Route path="lms/*" element={<Placeholder />} />
                        </Route>
                    </Route>

                    {/* 
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/cms" element={<CMSLayout />}>
                            <Route index element={<DashboardCms />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="page/:page_name" element={<ConsoleEditor />} />
                        </Route>
                    </Route> 
                    */}

                    <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                        <Route path="/employee" element={<AdminLayout />}>
                            <Route index element={<EmpDashboard />} />
                            <Route path="profile" element={<Profile />} />
                            {/* VSP Modules */}
                            <Route path="lms/courses" element={<MyCourses />} />
                            <Route path="lms/courses/:id" element={<CourseLessons />} />
                            <Route path="lms/progress" element={<MyProgress />} />
                            <Route path="lms/*" element={<Placeholder />} />
                            <Route path="hr/payslips" element={<MyPayslips />} />
                            <Route path="hr/leaves" element={<Leaves />} />
                            <Route path="hr/documents" element={<MyDocuments />} />
                            <Route path="hr/*" element={<Placeholder />} />
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['client']} />}>
                        <Route path="/client" element={<ClientLayout />}>
                            <Route index element={<ClientDashboard />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                            {/* VSP Modules */}
                            <Route path="workforce/team" element={<MyTeam />} />
                            <Route path="workforce/skills" element={<ClientSkills />} />
                            <Route path="workforce/leaves" element={<LeaveApprovals />} />
                            <Route path="recruitment/replacements" element={<Replacements />} />
                            <Route path="billing/invoices" element={<ClientInvoices />} />
                            <Route path="billing/payments" element={<ClientPayments />} />
                            <Route path="training/materials" element={<TrainingMaterials />} />
                            <Route path="training/contracts" element={<Contracts />} />
                        </Route>
                    </Route>



                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/cms" element={<CMSLayout />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
            <Modal />
        </Router>);
}

export default App;