/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import des icônes
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Login = () => {
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Pour afficher/masquer la confirmation du mot de passe
  const [passwordError, setPasswordError] = useState(""); // Pour afficher les erreurs de mot de passe

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
      if (name === "password") {
        validatePassword(value); // Valider le mot de passe à chaque changement
      }
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  // Fonction pour valider le mot de passe
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!isLongEnough) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
    } else if (!hasUpperCase || !hasNumber) {
      setPasswordError("Le mot de passe doit contenir au moins une majuscule et un chiffre.");
    } else {
      setPasswordError("");
    }
  };

  const handleRegistration = async (type) => {
    if (type === "signup") {
      if (signupInput.password !== signupInput.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }
      if (passwordError) {
        toast.error("Le mot de passe n'est pas valide.");
        return;
      }
    }

    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Compte créé avec succès");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Une erreur est survenue");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Connexion réussie");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Une erreur est survenue");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 bg-gradient-to-r from-teal-100 to-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] rounded-lg shadow-lg bg-opacity-80"
      >
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 border-b border-gray-300 gap-4">
            <TabsTrigger value="signup" className="text-lg font-semibold text-gray-600 hover:bg-gray-200">
              Créer un compte
            </TabsTrigger>
            <TabsTrigger value="login" className="text-lg font-semibold text-gray-600 hover:bg-gray-200">
              Se connecter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg rounded-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Créer un compte</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-200">Créez un compte pour commencer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      type="text"
                      name="name"
                      value={signupInput.name}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Votre nom"
                      required
                      className="border-2 rounded-md px-4 py-2 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={signupInput.email}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Votre email"
                      required
                      className="border-2 rounded-md px-4 py-2 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={signupInput.password}
                        placeholder="Votre mot de passe"
                        required
                        onChange={(e) => changeInputHandler(e, "signup")}
                        className="border-2 rounded-md px-4 py-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={signupInput.confirmPassword}
                        placeholder="Confirmez votre mot de passe"
                        required
                        onChange={(e) => changeInputHandler(e, "signup")}
                        className="border-2 rounded-md px-4 py-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    disabled={registerIsLoading || !!passwordError}
                    onClick={() => handleRegistration("signup")}
                    className="w-full py-2 bg-dark-blue text-white rounded-md hover:bg-dark-blue/80 transition-all duration-300 transform hover:scale-105"
                  >
                    {registerIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Attendez svp
                      </>
                    ) : (
                      "Créer un compte"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="login">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg rounded-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Se connecter</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-200">Connectez-vous pour commencer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={loginInput.email}
                      onChange={(e) => changeInputHandler(e, "login")}
                      placeholder="Votre email"
                      required
                      className="border-2 rounded-md px-4 py-2 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginInput.password}
                        placeholder="Votre mot de passe"
                        required
                        onChange={(e) => changeInputHandler(e, "login")}
                        className="border-2 rounded-md px-4 py-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    disabled={loginIsLoading}
                    onClick={() => handleRegistration("login")}
                    className="w-full py-2 bg-dark-blue text-white rounded-md hover:bg-dark-blue/80 transition-all duration-300 transform hover:scale-105"
                  >
                    {loginIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Attendez svp
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Login;