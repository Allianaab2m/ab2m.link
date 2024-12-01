{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }: flake-utils.lib.eachDefaultSystem(
    system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      corepack = pkgs.stdenv.mkDerivation {
        name = "corepack";
        buildInputs = [ pkgs.nodejs_22 ];
        phases = [ "installPhase" ];
        installPhase = ''
          mkdir -p $out/bin
          corepack enable --install-directory=$out/bin
        '';
      };
    in {
      packages.default = pkgs.mkShell {
        packages = [
          pkgs.nodejs_22
          corepack
        ];
      };
    }
  );
}
