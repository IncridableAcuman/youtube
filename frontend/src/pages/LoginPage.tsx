import {AuthLayout} from "@/components/auth/AuthLayout.tsx";
import {LoginForm} from "@/components/auth/LoginForm.tsx";


export const LoginPage = () => (
    <AuthLayout title="Xush kelibsiz" subtitle="Platformaga kirish uchun ma'lumotlaringizni kiriting">
        <LoginForm />
    </AuthLayout>
);