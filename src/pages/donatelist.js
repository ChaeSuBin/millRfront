import React, { useEffect, useState } from "react";
import { getDonateList } from "../api";

export const DonateList = () => {
	const [orgName, setOrg] = useState([]);

	useEffect(() => {
		getOrgList();
	},[])

	const getOrgList = async() => {
		const items = await getDonateList();
		setOrg(items);
	}
	return(<>
		<p>Nonprofit organization which the royalty of NFT is designated to</p>
		{orgName.map((searchItems, index) => (
			<DonateListCpnt
				key={index}
				orgName={searchItems.tempdonate}
			/>
    ))}
	</>)
}
const DonateListCpnt = ({orgName}) => {
	return(<>
		<li>{orgName}</li>
	</>)
}