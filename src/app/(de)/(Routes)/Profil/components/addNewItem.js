import React from "react";
import { Button } from "@/components/ui/button";

const AddNewItems = ({ onClick }) => {
  return (
    <Button type="button" onClick={onClick} variant="outline">
      Neues Item hinzufügen
    </Button>
  );
};

export { AddNewItems };
