# How to read a pinout reference

Distinguish physical connector positions, GPIO names and alternate functions before wiring.

## Position and signal name are different

A physical position tells you where a contact is on a particular connector. A signal name tells you what it connects to. GPIO numbers, Arduino-style labels and connector positions can all differ. Do not assume a label such as D4 means the fourth physical pin.



## Orient the board

1. Match the model and revision. Check whether the drawing shows the top, bottom, connector mating face or cable side.
2. Locate pin 1, USB, antenna and other landmarks. A view from the opposite side can reverse the apparent order.
3. Locate power and ground before signals. Read supply ranges and logic levels from the manufacturer documentation.
4. Check alternate functions, startup restrictions and pins already used by onboard hardware.
5. Trace each wire against the reference and verify the disconnected circuit before applying power.



## Understand the reference type

Physical pinout sources may cover only one connector. Pin-function tables explain signal names and purposes, but do not always locate contacts on the PCB. Package maps refer to the chip itself. Board labels, product photos and block diagrams are supporting references, not substitutes for physical board pinouts.



## Read Black Wire callouts

Some annotated manufacturer-model sheets use K callouts. K01 connects the illustration to its table; it is not an inferred GPIO number or header position. The sheet states the model and scope. Unmodeled contacts and other family members remain outside that sheet’s coverage.



[Read the public wiki](https://valleytech-black-wire-guide.pages.dev/wiki/reading-pinouts/) · [Open the guide](https://valleytech-black-wire-guide.pages.dev/)
