declare module "react-div-100vh" {
  type Div100vhProps = {
    as?: string | JSXElementConstructor<any>;
  } & HTMLAttributes<HTMLElement>;
  declare class Div100vh extends React.Component<Div100vhProps> {}
  export = Div100vh;
}
