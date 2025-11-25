import { useState } from "react";
import Dropdown from "./Dropdown.tsx";

function Header() {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <h1>Campaign Analytics</h1>
      <Dropdown
        options={["Hourly", "Daily", "wheekly", "Monthly"]}
        value={selected}
        onChange={(selectedValue: string) => {
          setSelected(selectedValue);
        }}
        placeholder={"select"}
      ></Dropdown>
    </div>
  );
}

export default Header;
