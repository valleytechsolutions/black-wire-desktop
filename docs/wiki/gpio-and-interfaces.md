# GPIO, I²C, SPI and UART

A quick introduction to the signal names you will meet in maker pinout sheets.

## GPIO: a configurable digital connection

A general-purpose input/output pin can read or drive a digital logic state when configured by software. Many pins can also connect to a peripheral function. Power and ground pins are not interchangeable with GPIO. Check the exact board specifications for logic levels, current limits, startup behavior and alternate functions. Raspberry Pi computer GPIO uses 3.3 V logic; a 5 V power contact on its header does not make its GPIO 5 V tolerant.

[Raspberry Pi GPIO documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio)

## I²C: addressed devices on a bus

SDA carries data and SCL carries the clock. Devices share the bus and are selected by address. Pull-up resistors are part of the interface; their voltage and the combined resistance of multiple breakout boards matter. Check available addresses, bus voltage and the board’s pin assignment. The connector order is not guaranteed by the fact that it carries I²C.

[Arduino I²C guide](https://docs.arduino.cc/learn/communication/wire/)

## SPI: clocked data and device selection

Common labels include SCK or SCLK for clock, MOSI or COPI for controller output, MISO or CIPO for controller input, and CS for device selection. Displays may add DC, RESET and backlight controls. Some devices use only one data direction. Match the documented clock mode, voltage, selection and pin mapping; a shared controller chip does not guarantee a shared module connector.

[Arduino SPI guide](https://docs.arduino.cc/learn/communication/spi/)

## UART: asynchronous transmit and receive

TX is the transmitting signal and RX is the receiving signal. For a typical logic-level UART link, one device’s TX connects to the other’s RX, with compatible voltage and a shared reference ground. Both ends must agree on baud rate and framing. UART pins are not automatically compatible with RS-232 or RS-485 electrical signaling; those interfaces need appropriate transceivers.

[Arduino UART guide](https://docs.arduino.cc/learn/communication/uart/)

## Make a project connection table

For each wire, record the source connector and position, signal name, destination connector and position, logic or supply voltage, and documentation used. Record the firmware pin assignment alongside the physical connection. The interface name alone is not enough to select a safe pin.



[Read the public wiki](https://valleytech-black-wire-guide.pages.dev/wiki/gpio-and-interfaces/) · [Open the guide](https://valleytech-black-wire-guide.pages.dev/)
