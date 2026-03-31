import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Breadcrumb, Divider } from 'antd';
import { User, Mail, Phone, Lock, ArrowLeft, Save } from 'lucide-react';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';
import Card from '../Components/Card';

const { Option } = Select;

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // Queries
    const { data: userResponse, isLoading: fetching } = Queries.useGetSingleUser(id);
    
    // Mutations
    const addUser = Mutations.useAddUser();
    const editUser = Mutations.useEditUser();

    useEffect(() => {
        if (isEditMode && userResponse?.data) {
            const userData = userResponse.data;
            form.setFieldsValue({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                phoneNo: userData.contact?.phoneNo || '',
                isActive: userData.isActive
            });
        }
    }, [isEditMode, userResponse, form]);

    const onFinish = async (values: any) => {
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            role: isEditMode ? values.role : 'user',
            contact: { countryCode: '+91', phoneNo: values.phoneNo },
            ...(values.password && { password: values.password }),
            ...(isEditMode ? { userId: id, isActive: values.isActive } : { isActive: true })
        };

        const mutation = isEditMode ? editUser : addUser;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200) {
                    toast.success(`User ${isEditMode ? 'updated' : 'created'} successfully`);
                    navigate(ROUTES.USERS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || 'Something went wrong');
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="text-left">
                    <Breadcrumb 
                        className="mb-2 text-left"
                        items={[
                            { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                            { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.USERS)}>Users</span> },
                            { title: isEditMode ? 'Edit User' : 'Add User' }
                        ]}
                    />
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">
                        {isEditMode ? 'Edit User Profile' : 'Create New User'}
                    </h1>
                </div>
                <Button 
                    type="default" 
                    icon={<ArrowLeft size={16} />} 
                    onClick={() => navigate(ROUTES.USERS)}
                    className="h-12 px-6 rounded-2xl font-bold border-2 flex items-center gap-2"
                >
                    Back to List
                </Button>
            </div>

            <Card className="rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left">
                <div className="p-1 text-left">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ role: 'user', isActive: true }}
                        requiredMark={false}
                        className="max-w-4xl mx-auto py-8 text-left"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="col-span-2 text-left">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                                    <User size={20} className="text-primary-500" /> Personal Information
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800 text-left" />
                            </div>

                            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">First Name</span>} name="firstName" rules={[{ required: true }]} className="text-left">
                                <Input size="large" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="Enter first name" />
                            </Form.Item>

                            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Last Name</span>} name="lastName" rules={[{ required: true }]} className="text-left">
                                <Input size="large" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="Enter last name" />
                            </Form.Item>

                            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Email Address</span>} name="email" rules={[{ required: true, type: 'email' }]} className="text-left">
                                <Input size="large" prefix={<Mail size={16} className="mr-2 text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="name@company.com" />
                            </Form.Item>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Phone Number</span>} 
                                name="phoneNo" 
                                rules={[
                                    { required: true, message: 'Please enter phone number' },
                                    { pattern: /^[0-9]+$/, message: 'Please enter only digits' }
                                ]}
                                className="text-left"
                            >
                                <Input 
                                    size="large" 
                                    prefix={<Phone size={16} className="mr-2 text-slate-400" />} 
                                    className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" 
                                    placeholder="10 digit mobile number"
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>

                            <div className="col-span-2 mt-4 text-left">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                                    <Lock size={20} className="text-primary-500" /> Access & Security
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800 text-left" />
                            </div>

                            {isEditMode && (
                                <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Role</span>} name="role" rules={[{ required: true }]} className="text-left">
                                    <Select size="large" className="custom-select h-12 rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl text-left dark:bg-slate-800 dark:text-white dark:border-slate-700">
                                        <Option value="user">Standard User</Option>
                                        <Option value="admin">Administrator</Option>
                                    </Select>
                                </Form.Item>
                            )}

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Password</span>} 
                                name="password" 
                                rules={[{ required: !isEditMode, message: 'Password is required' }]}
                                extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block text-left">{isEditMode ? 'Leave blank to keep existing password' : 'Create a secure password'}</span>}
                                className="text-left"
                            >
                                <Input.Password size="large" prefix={<Lock size={16} className="mr-2 text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="••••••••" />
                            </Form.Item>
                        </div>

                        <div className="mt-12 flex items-center gap-4 text-left">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={addUser.isPending || editUser.isPending || fetching}
                                icon={<Save size={18} />}
                                className="h-14 px-10 rounded-2xl font-black text-lg bg-primary-600 hover:bg-primary-700 border-0 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                            >
                                {isEditMode ? 'Update User' : 'Create User'}
                            </Button>
                            <Button 
                                onClick={() => navigate(ROUTES.USERS)}
                                className="h-14 px-8 rounded-2xl font-bold text-slate-600 border-2"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default UserForm;
