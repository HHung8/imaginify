import Header from "@/components/shared/Header";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if (!userId) {
    redirect("/sign-in");
    return null; // Ensure that the function exits after redirecting
  }

  const user = await getUserById(userId);
  if (!user) {
    redirect("/sign-in");
    return null; // Ensure that the function exits after redirecting
  }

  return (
    <Header title={transformation.title} subtitle={transformation.subTitle} />
  );
};

export default AddTransformationTypePage;
