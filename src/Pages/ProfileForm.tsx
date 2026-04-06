import React, { useEffect, useMemo } from 'react';
import { Form, Input, Tabs } from 'antd';
import { Mail, KeyRound, Settings } from 'lucide-react';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Button from '../Components/Button';
import { ProfileData } from '../Types';
import { Mutations } from '../Api/Mutations';
import { toast } from 'react-toastify';

type ProfileFormProps = {
  profile: ProfileData;
  userId?: string;
};

const buildPhoneValue = (countryCode?: string, phone?: string) => {
  const cleanCode = (countryCode || '').replace(/\s+/g, '').replace('+', '');
  const cleanPhone = (phone || '').replace(/\s+/g, '');

  if (!cleanCode && !cleanPhone) return '';
  return `${cleanCode}${cleanPhone}`;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, userId }) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const editUser = Mutations.useEditUser();
  const changePassword = Mutations.useChangePassword();

  const initialValues = useMemo( () => ({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      countryCode: profile.countryCode || '',
      role: profile.role || '',
      location: '',
    }), [profile], );

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const onFinish = (values: any) => {
    if (!userId) {
      toast.error('User not found');
      return;
    }

    const payload = {
      userId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      contact: {
        countryCode: values.countryCode || '',
        phoneNo: values.phone || '',
      },
    };

    editUser.mutate(payload, {
      onSuccess: (res: any) => {
        if (res?.status === 200) {
            return;
        //   toast.success('Profile updated successfully');
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Something went wrong');
      },
    });
  };

  const generalTab = (
    <div className="space-y-6">
      <div className='flex items-center gap-3 text-left'>
        <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
          <Settings size={18} />
        </div>
        <div className="text-left">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">
            Account Settings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your profile details and contact information.
            </p>
        </div>
      </div>

      <Form layout="vertical" requiredMark={false} form={form} initialValues={initialValues} onFinish={onFinish} className="text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">First Name</span>} name="firstName" className="text-left" rules={[{ required: true, message: 'Please enter first name' }]}   >
            <Input size="large" placeholder="First name" className="h-11 rounded-lg border-gray-200 focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </Form.Item>

          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Last Name</span>} name="lastName" className="text-left" rules={[{ required: true, message: 'Please enter last name' }]}   >
            <Input size="large" placeholder="Last name" className="h-11 rounded-lg border-gray-200 focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </Form.Item>

          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Phone Number</span>} name="phone" className="text-left" rules={[   { required: true, message: 'Please enter phone number' }, ]}   >
            <Form.Item shouldUpdate noStyle>
                {() => {
                const currentCountryCode = form.getFieldValue('countryCode');
                const currentPhone = form.getFieldValue('phone');
                const phoneValue = buildPhoneValue(currentCountryCode, currentPhone);

                return (
                  <PhoneInput country="in" value={phoneValue}
                    onChange={(value: string, countryData: CountryData | {}) => {
                      const dialCode = countryData && 'dialCode' in countryData && countryData.dialCode   ? `${countryData.dialCode}`   : '';
                      const formattedCountryCode = dialCode ? `+${dialCode}` : '';
                      let nationalNumber = value || '';

                      if (dialCode && nationalNumber.startsWith(dialCode)) {
                        nationalNumber = nationalNumber.slice(dialCode.length);
                      }

                      form.setFieldsValue({
                        countryCode: formattedCountryCode,
                        phone: nationalNumber,
                      });
                    }}
                    containerClass="w-full akayra-phone-input"
                    inputClass="akayra-phone-input__control"
                    buttonClass="akayra-phone-input__button"
                    dropdownClass="akayra-phone-input__dropdown"
                    inputProps={{
                      name: 'phone',
                      placeholder: 'Phone number',
                    }}
                  />
                );
              }}
            </Form.Item>
          </Form.Item>

          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Email Address</span>} name="email" className="text-left" rules={[   { required: true, message: 'Please enter email' },   { type: 'email', message: 'Please enter a valid email address' }, ]}>
            <Input size="large" placeholder="Email address" prefix={<Mail size={16} className="text-slate-400" />} className="h-11 rounded-lg border-gray-200 focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </Form.Item>
          
          <Form.Item name="countryCode" hidden>
            <Input />
          </Form.Item>
        </div>

        <div className="mt-6 flex items-center justify-start">
          <Button  type="submit"  loading={editUser.isPending}  className="h-10 px-6 rounded-lg font-bold bg-primary-600 hover:bg-primary-700 text-white"   >
            Update
          </Button>
        </div>
      </Form>
    </div>
  );

  const passwordTab = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-left">
        <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
          <KeyRound size={18} />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight text-left">
            Change Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep a strong password to secure your account.
          </p>
        </div>
      </div>

      <Form form={passwordForm} layout="vertical" requiredMark={false} className="text-left" initialValues={{   currentPassword: '',   newPassword: '',   confirmNewPassword: '', }}
        onFinish={(values) => {
          changePassword.mutate(values, {
            onSuccess: (res: any) => {
              if (res?.status === 200) {
                toast.success('Password changed successfully');
                passwordForm.resetFields();
              }
            },
            onError: (err: any) => {
              const message = err?.response?.data?.message || 'Something went wrong';
              const lowerMessage = String(message).toLowerCase();
              let fieldName: 'currentPassword' | 'newPassword' | 'confirmNewPassword' = 'currentPassword';

              if (lowerMessage.includes('confirm') && lowerMessage.includes('match')) {
                fieldName = 'confirmNewPassword';
              } else if (lowerMessage.includes('different') || lowerMessage.includes('new password')) {
                fieldName = 'newPassword';
              }

              passwordForm.setFields([{ name: fieldName, errors: [message] }]);
            },
          });
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Current Password</span>} name="currentPassword" className="text-left md:col-span-2" rules={[{ required: true, message: 'Please enter current password' }]}   >
            <Input.Password  size="large"  placeholder="Enter current password"  className="h-11 rounded-lg border-gray-200 focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </Form.Item>

          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">New Password</span>} name="newPassword" className="text-left" rules={[   { required: true, message: 'Please enter new password' },   { min: 6, message: 'Password must be at least 6 characters' }, ]}   >
            <Input.Password size="large" placeholder="Create new password" className="h-11 rounded-lg border-gray-200 focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </Form.Item>

          <Form.Item label={<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Confirm Password</span>} name="confirmNewPassword" className="text-left" dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Confirm new password must match new password'));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Re-enter new password" className="h-11 rounded-lg border-gray-200 focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </Form.Item>

          <div className="md:col-span-2 flex justify-start">
            <Button type="submit" loading={changePassword.isPending} className="h-10 px-6 rounded-lg font-bold bg-primary-600 hover:bg-primary-700 text-white" >
              Update
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );

  return (
    <div className="rounded-2xl sm:rounded-[28px] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <Tabs defaultActiveKey="general" destroyInactiveTabPane={false} className="profile-tabs [&_.ant-tabs-nav]:!m-0 [&_.ant-tabs-nav]:!px-5 sm:[&_.ant-tabs-nav]:!px-6 [&_.ant-tabs-nav]:!pt-4 [&_.ant-tabs-nav]:!pb-0 [&_.ant-tabs-nav]:!border-b [&_.ant-tabs-nav]:!border-gray-100 dark:[&_.ant-tabs-nav]:!border-slate-800 [&_.ant-tabs-content-holder]:!px-5 sm:[&_.ant-tabs-content-holder]:!px-6 [&_.ant-tabs-content-holder]:!py-5 sm:[&_.ant-tabs-content-holder]:!py-6"
        items={[
          { key: 'general', label: <span className="text-sm font-semibold">Account Settings</span>, children: generalTab },
          { key: 'password', label: <span className="text-sm font-semibold">Change Password</span>, children: passwordTab },
        ]}
      />
    </div>
  );
};

export default ProfileForm;
