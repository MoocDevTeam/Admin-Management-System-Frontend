import React from "react";
import { useSelector } from "react-redux";

export default function AuthButton(props) {
  const userPermission = useSelector((state) => state.permission);
  if (
    props.permission === undefined ||
    props.permission === null ||
    props.permission === ""
  ) {
    return props.children;
  }
  if (userPermission === undefined || userPermission === null) {
    return null;
  }
  if (
    userPermission.permission === undefined ||
    userPermission.permission === null ||
    userPermission.permission === ""
  ) {
    return null;
  }
  if (userPermission.permission.indexOf(props.permission) > -1) {
    return props.children;
  } else {
    return null;
  }
}
