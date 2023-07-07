import { MuiListInferencer } from "@refinedev/inferencer/mui";
import {GetServerSideProps} from "next";
import {authProvider} from "../../src/providers/authProvider";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export default function GroupsList() {
    return <MuiListInferencer hideCodeViewerInProduction />;
}
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const { authenticated, redirectTo } = await authProvider.check(context);

    const translateProps = await serverSideTranslations(context.locale ?? "fr", [
        "common",
    ]);

    if (!authenticated) {
        return {
            props: {
                ...translateProps,
            },
            redirect: {
                destination: `${redirectTo}?to=${encodeURIComponent("/groups")}`,
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
