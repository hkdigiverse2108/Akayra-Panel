import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Card, Breadcrumb, Divider } from 'antd';
import { User, Mail, Phone, Lock, ArrowLeft, Save } from 'lucide-react';
import { userAPI } from '../services/apiService';

const { Option } = Select;

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchUserDetails();
        }
    }, [id]);

    const fetchUserDetails = async () => {
        setFetching(true);
        try {
            // Using centralized userAPI with dynamic path parameter
            const response = await userAPI.getById(id as string);
            if (response.data.status === 200) {
                const userData = response.data.data;
                form.setFieldsValue({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: userData.role,
                    phoneNo: userData.contact?.phoneNo || '',
                    isActive: userData.isActive
                });
            }
        } catch (error: any) {
            console.error('Fetch user details error:', error);
            navigate('/users');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                role: isEditMode ? values.role : 'user',
                contact: { countryCode: '+91', phoneNo: values.phoneNo },
                ...(values.password && { password: values.password }),
                ...(isEditMode ? { userId: id, isActive: values.isActive } : { isActive: true })
            };

            // Using centralized userAPI with dynamic body data
            const response = isEditMode 
                ? await userAPI.edit(payload)
                : await userAPI.add(payload);

            if (response.data.status === 200) {
                navigate('/users');
            }
        } catch (error: any) {
            console.error('Submit user error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Breadcrumb 
                        className="mb-2"
                        items={[
                            { title: <a onClick={() => navigate('/dashboard')}>Dashboard</a> },
                            { title: <a onClick={() => navigate('/users')}>Users</a> },
                            { title: isEditMode ? 'Edit User' : 'Add User' }
                        ]}
                    />
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isEditMode ? 'Edit User Profile' : 'Create New User'}
                    </h1>
                </div>
                <Button 
                    type="default" 
                    icon={<ArrowLeft size={16} />} 
                    onClick={() => navigate('/users')}
                    className="h-12 px-6 rounded-2xl font-bold border-2 flex items-center gap-2"
                >
                    Back to List
                </Button>
            </div>

            <Card className="rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900">
                <div className="p-1">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ role: 'USER', isActive: true }}
                        requiredMark={false}
                        className="max-w-4xl mx-auto py-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <User size={20} className="text-primary-500" /> Personal Information
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800" />
                            </div>

                            <Form.Item label={<span className="font-bold text-slate-600">First Name</span>} name="firstName" rules={[{ required: true }]}>
                                <Input size="large" className="h-12 rounded-xl" />
                            </Form.Item>

                            <Form.Item label={<span className="font-bold text-slate-600">Last Name</span>} name="lastName" rules={[{ required: true }]}>
                                <Input size="large" className="h-12 rounded-xl" />
                            </Form.Item>

                            <Form.Item label={<span className="font-bold text-slate-600">Email</span>} name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input size="large" prefix={<Mail size={16} className="mr-2" />} className="h-12 rounded-xl" />
                            </Form.Item>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600">Phone</span>} 
                                name="phoneNo" 
                                rules={[
                                    { required: true, message: 'Please enter phone number' },
                                    { pattern: /^[0-9]+$/, message: 'Please enter only digits' }
                                ]}
                            >
                                <Input 
                                    size="large" 
                                    prefix={<Phone size={16} className="mr-2" />} 
                                    className="h-12 rounded-xl" 
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>

                            <div className="col-span-2 mt-4">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <Lock size={20} className="text-primary-500" /> Access & Security
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800" />
                            </div>

                            {isEditMode && (
                                <>
                                    <Form.Item label={<span className="font-bold text-slate-600">Role</span>} name="role" rules={[{ required: true }]}>
                                        <Select size="large">
                                            <Option value="USER">Standard User</Option>
                                            <Option value="ADMIN">Administrator</Option>
                                        </Select>
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item label={<span className="font-bold text-slate-600">Password</span>} name="password" rules={[{ required: !isEditMode }]}>
                                <Input.Password size="large" prefix={<Lock size={16} className="mr-2" />} className="h-12 rounded-xl" />
                            </Form.Item>
                        </div>

                        <div className="mt-12 flex items-center gap-4">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading || fetching}
                                icon={<Save size={18} />}
                                className="h-14 px-10 rounded-2xl font-black text-lg bg-primary-500"
                            >
                                {isEditMode ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default UserForm;
