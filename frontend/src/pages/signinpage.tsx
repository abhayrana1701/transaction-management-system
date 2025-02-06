import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/authform";


const SignInPage: React.FC = () => {
  const navigate = useNavigate();


  const handleSuccess = (data: any) => {
   
    navigate("/");
  };

  return <AuthForm type="signin" onSuccess={handleSuccess} />;
};

export default SignInPage;
