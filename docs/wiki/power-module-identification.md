# Find a power-module reference

Distinguish buck, boost, buck-boost, charger and protection records before selecting a pinout.

## Separate the jobs

The catalog groups voltage conversion, battery charging, protection, UPS and fuel-gauge references under Power & charging. These serve different functions. A familiar charger chip does not tell you whether the complete board includes protection, regulated output or a power path for running a load.



## Search the actual variant

Try buck, step-down, boost, step-up, buck-boost, TP4056 or TP4057. Match connector and terminal labels against the exact source drawing. A chip-package diagram identifies IC pins; it is not a physical terminal map for every inexpensive module using that chip.



## Record the evidence you need

- Exact PCB model or clear identification of the generic variant.
- Separate input, output and battery terminal labels, with polarity.
- Documented input range, configured output and load limits.
- Battery chemistry and charging requirements when applicable.
- Documented protection and power-path behavior for that board.



## Use the power desk

The app has sourced profiles, adapter comparisons, runtime estimates and power budgets. Published observations, manufacturer requirements and your own measurements remain distinct. A typical observed current is not a maximum rating. Estimates depend on your inputs and do not establish compatibility for an unidentified module.



[Read the public wiki](https://valleytech-black-wire-guide.pages.dev/wiki/power-module-identification/) · [Open the guide](https://valleytech-black-wire-guide.pages.dev/)
