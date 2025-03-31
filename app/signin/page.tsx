"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import lcmu from "@/public/lcmu_white.png";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export default function SignIn() {
    const [internID, setInternID] = useState("");
    const [internPassword, setInternPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInternSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", {
                internID,
                password: internPassword,
                redirect: false,
            });
            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-900 '>
            <div className='rounded-lg border-2 border-gray-700 py-2 w-[400px] max-w-full'>
                <Image src={lcmu} alt='lcmu' className='w-40 sm:w-60 h-auto mx-auto mt-4' />
                <Tabs defaultValue="intern" className="w-full bg-gray-900 text-white p-4 rounded-lg">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-6 rounded-lg">
                        <TabsTrigger value="intern" className="data-[state=active]:bg-gray-700 py-2 px-4 mx-2 rounded-lg data-[state=active]:text-gray-50 text-sm sm:text-base">
                            Intern
                        </TabsTrigger>
                        <TabsTrigger value="lc" className="data-[state=active]:bg-gray-700 py-2 px-4 mx-2 rounded-lg data-[state=active]:text-gray-50 text-sm sm:text-base">
                            LC
                        </TabsTrigger>
                    </TabsList>

                    {/* Intern Tab */}
                    <TabsContent value="intern">
                        <Card className="bg-gray-800 text-white border border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Intern</CardTitle>
                                <CardDescription className="text-sm sm:text-base">Intern Login page.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="p-3 mb-4 text-sm text-white bg-red-500 rounded">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="intern-id" className="text-white text-sm sm:text-base">Intern ID</Label>
                                    <Input id="intern-id" placeholder="Intern ID" className="bg-gray-700 text-white border border-gray-600"
                                        value={internID} onChange={(e) => setInternID(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="intern-password" className="text-white text-sm sm:text-base">Password</Label>
                                    <Input id="intern-password" type="password" placeholder="Password" className="bg-gray-700 text-white border border-gray-600"
                                        value={internPassword} onChange={(e) => setInternPassword(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button className="bg-blue-600 hover:bg-blue-500 text-sm sm:text-base" type="submit" onClick={handleInternSignIn} disabled={isLoading}>
                                    {isLoading ? "Signing in..." : "Login"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* LC Tab */}
                    <TabsContent value="lc">
                        <Card className="bg-gray-800 text-white border border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">LC</CardTitle>
                                <CardDescription className="text-sm sm:text-base">Login as Local Committee Manipal.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="lc-email" className="text-white text-sm sm:text-base">LC Email</Label>
                                    <Input id="lc-email" type="email" placeholder="LC Email" className="bg-gray-700 text-white border border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="lc-password" className="text-white text-sm sm:text-base">Password</Label>
                                    <Input id="lc-password" type="password" placeholder="Password" className="bg-gray-700 text-white border border-gray-600" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-between">
                                <a href="#" className="text-sm text-blue-400 hover:underline mb-2 sm:mb-0">Forgot password?</a>
                                <Button className="bg-blue-600 hover:bg-blue-500 text-sm sm:text-base">Login</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
