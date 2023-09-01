import * as React from "react";
import {Routes, useNavigation} from "../routing/useRouting";
import {Link, Text} from "@hubspot/ui-extensions";

export interface BreadCrumbsProps {
    crumbs: { label: string, screen: Routes | null, active: boolean }[];
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({crumbs}) => {
    const navigation = useNavigation();

    return (
        <>
            {crumbs.map((crumb, index) => crumb.screen !== null
                ? (
                    <Link
                        key={index}
                        href={`#${crumb.screen}`}
                        preventDefault={true}
                        onClick={() => navigation.navigateTo(crumb.screen!)}
                    >
                        {`${crumb.label} ${index !== crumbs.length - 1 ? ">" : ""}`}
                    </Link>
                )
                : (
                    <Text
                        key={index}
                        format={{
                            fontWeight: crumb.active ? "bold" : "regular",
                            lineDecoration: crumb.active ? "underline" : "none",
                        }}
                    >
                        {`${crumb.label} ${index !== crumbs.length - 1 ? ">" : ""}`}
                    </Text>
                )
            )}
        </>
    );
}

export default BreadCrumbs;