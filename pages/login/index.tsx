import { AuthPage, ThemedTitleV2 } from "@refinedev/mui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "../../src/providers/authProvider";
import { AppIcon } from "src/components/app-icon";

export default function Login() {
  return (
    <AuthPage
      type="login"
      rememberMe={false}
      forgotPasswordLink={false}
      registerLink={false}
      title={
        <ThemedTitleV2
          collapsed={false}
          text="Admin Open Course Project"
          icon={<AppIcon />}
        />
      }
    />
  );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "fr", [
    "common",
  ]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
