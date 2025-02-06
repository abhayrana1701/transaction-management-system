import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/authform";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();


  const handleSuccess = (data: any) => {

    navigate("/");
  };

  return <AuthForm type="signup" onSuccess={handleSuccess} />;
};

export default SignUpPage;
