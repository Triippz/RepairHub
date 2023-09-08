import * as React from "react";
import {Routes, useNavigation} from "../routing/useRouting";
import {Flex, Link, Text} from "@hubspot/ui-extensions";

export interface BreadCrumbsProps {
    crumbs: { label: string, screen: Routes | null, active: boolean }[];
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({crumbs}) => {
    const navigation = useNavigation();

    return (
        <Flex justify={"start"} direction="row">
            {crumbs.map((crumb, index) => (
                <>
                    {index !== 0 && <Text>{" > "}</Text>}
                    {crumb.screen !== null ? (
                        <Link
                            key={index}
                            href={`#${crumb.screen}`}
                            preventDefault={true}
                            onClick={() => navigation.navigateTo(crumb.screen!)}
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <Text
                            key={index}
                            format={{
                                fontWeight: crumb.active ? "bold" : "regular",
                                lineDecoration: crumb.active ? "underline" : "none",
                            }}
                        >
                            {crumb.label}
                        </Text>
                    )}
                </>
            ))}
        </Flex>
    );
}

export default BreadCrumbs;