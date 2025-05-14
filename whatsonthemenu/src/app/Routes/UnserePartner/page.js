"use client"
import { useState } from "react"

const item1 = { name: "Restaurant1", id: "1" };
const item2 = { name: "Restaurant2", id: "2" };
const item3 = { name: "Restaurant3", id: "3" };
const item4 = { name: "Restaurant4", id: "4" };
const item5 = { name: "Restaurant5", id: "5" };
const item6 = { name: "Restaurant6", id: "6" };
const item7 = {
  name: "Restaurant7aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  id: "7",
};
const RestaurantList = [item1, item2, item3, item4, item5, item6, item7];

export default function PartnerListe() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [list, setList] = useState(RestaurantList);

    return(
        <div>
        </div>
    )
}