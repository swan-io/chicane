module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets:
          process.env.NODE_ENV === "test"
            ? { node: "current" }
            : ">0.2%, not op_mini all, not dead",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-transform-react-jsx"],
};
