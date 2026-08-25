import {AuthLayout} from "@/components/auth/AuthLayout.tsx";
import {RegisterForm} from "@/components/auth/RegisterForm.tsx";


export const RegisterPage = () => (
    <AuthLayout title="Hisob yaratish" subtitle="YouTube jamiyatiga qo'shiling va kontent ulashing">
        <RegisterForm />
    </AuthLayout>
);