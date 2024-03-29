import { style } from "@vanilla-extract/css";

export const formContainer = style({
  display: "flex",
  justifyContent: "center",
  // height: "100vh",
});

export const formContainer__form = style({
  display: "flex",
  flexDirection: "column",
  // todo: responsivity
  // todo: percentage
  width: "300px",
});

export const formContainer__form__img = style({
  width: "64px",
  height: "64px",
});

export const formContainer__form__header = style({
  alignSelf: "center",
});

export const formContainer__form__error = style({
  padding: "1rem",
  marginBottom: "1rem",
  border: "1px solid red",
  background: "LightPink",
  borderRadius: "10px",
});

export const formContainer__form__errorText = style({
  color: "red",
});

export const formContainer__form__field = style({
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "column",
});

export const formContainer__form__field__img = style({
  marginBottom: "1rem",
  width: "100px",
  height: "auto",
});

export const formContainer__form__passwordLabel = style({
  display: "flex",
  justifyContent: "space-between",
});

export const formContainer__form__p = style({
  textAlign: "center",
});
