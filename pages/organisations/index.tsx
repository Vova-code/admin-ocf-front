import {GetServerSideProps} from "next";
import {authProvider} from "../../src/providers/authProvider";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {EditButton, List, ShowButton, useDataGrid} from "@refinedev/mui";
import React, {Suspense} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import IOrganisation from "../../src/interfaces/resources";
import {Skeleton} from "@mui/material";

export default function OrganisationsList() {
    const {dataGridProps} = useDataGrid<IOrganisation>()

    const columns = React.useMemo<GridColDef<IOrganisation>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "string",
                minWidth: 100,
            },
            {
                field: "name",
                headerName: "Nom",
                flex: 1
            },
            {
                field: "groups",
                headerName: "Groupes",
                type: "number",
                renderCell: ({row}) => {
                    return row.groups?.length
                },
                flex: 1
            },
            {
                field: "actions",
                headerName: "Actions",
                renderCell: function render({row}) {
                    return (
                        <>
                            <EditButton size="small" recordItemId={row.id} hideText/>
                            <ShowButton size="small" recordItemId={row.id} hideText/>
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                minWidth: 180,
            },
        ],
        [],
    );

    return (
        <List
            resource="organisations"
            createButtonProps={{size: "small"}}
            canCreate
        >
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
            />
        </List>
    );
}
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const {authenticated, redirectTo} = await authProvider.check(context);

    const translateProps = await serverSideTranslations(context.locale ?? "fr", [
        "common",
    ]);

    if (!authenticated) {
        return {
            props: {
                ...translateProps,
            },
            redirect: {
                destination: `${redirectTo}?to=${encodeURIComponent("/organisations")}`,
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
