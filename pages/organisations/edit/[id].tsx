import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {authProvider} from "../../../src/providers/authProvider";
import {Edit, EditButton, ShowButton, useAutocomplete} from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import {Box, Skeleton, TextField} from "@mui/material";
import {useForm} from "@refinedev/react-hook-form";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import React from "react";
import IOrganisation from "../../../src/interfaces/resources";

export default function OrganisationsEdit() {
    const {
        saveButtonProps,
        refineCore: {queryResult},
        register,
        control,
        formState: {errors},
    } = useForm();

    const samplesData = queryResult?.data?.data;

    console.log("Data :", samplesData);

    const {autocompleteProps: groupsAutocompleteProps} = useAutocomplete({
        resource: "groups",
        defaultValue: samplesData?.groups?.id,
    });

    const columns = React.useMemo<GridColDef<IOrganisation>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "string",
                flex: 1
            },
            {
                field: "groupName",
                headerName: "Nom",
                flex: 1
            },
            {
                field: "parentGroupId",
                headerName: "Groupe Parent",
                type: "string",
                flex: 1
            },
        ],
        [],
    );

    return (
        <Edit
            title={<Typography variant="h5">Modifier</Typography>}
            canDelete={false}
        >
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("id", {
                        required: "Ce champ est requis",
                    })}
                    error={!!(errors as any)?.id}
                    helperText={(errors as any)?.id?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label="Id"
                    name="id"
                    disabled
                />
                <TextField
                    {...register("name", {
                        required: "Ce champ est requis",
                    })}
                    error={!!(errors as any)?.title}
                    helperText={(errors as any)?.title?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label="Title"
                    name="title"
                />
                {samplesData ? (
                    <DataGrid
                        aria-label="Groupes de l'Organisation"
                        columns={columns}
                        pageSizeOptions={[5]}
                        rows={samplesData?.groups}
                        style={{ marginTop: 12 }}
                    />
                ) : (
                    <Skeleton animation="pulse" style={{ minHeight: 80 }}/>
                )}
            </Box>
        </Edit>
    )
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
