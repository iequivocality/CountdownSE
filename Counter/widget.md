# StreamElements Counter Widget

Basic counter widget for StreamElements, can be controlled and updated by using twitch chat commands.

## Features

#### Twitch Chat Integration
The following Twitch chat commands can control the counter. These commands can be customized by changing the widget settings (See section on **Customizable Settings**)
| Command | Description | Usage |
| ------ | ------ | ------ |
| !counter | Twitch chat command for showing counter (if hidden). **Can be used by anyone in chat**. | `!counter` |
| !counter <number> | Twitch chat command for setting the counter to a specific number. **Can only be used by the broadcaster and mods**. | `!counter <number>` (example: `!counter 15` to set counter to *15*) |
| !counterup | Twitch chat command for adding 1 to the counter. **Can only be used by the broadcaster and mods**. | `!counterup` |
| !counterdown | Twitch chat command for subtracting 1 from the counter. **Can only be used by the broadcaster and mods**. | `!counterdown` |
| !counterreset | Twitch chat command for resetting the counter to 0. **Can only be used by the broadcaster and mods**. | `!counterreset` |

#### Customizable Settings
The following can be customized by accessing the widget settings (excluding font settings):

| Field | Description | Default Value |
| ------ | ------ | ------ |
| Counter Label | Label for the counter | Counter |
| Hide animation | Animation style for the counter if not permanently on the overlay (See section on **Hide Animation options**)| None |
| Hide delay | Delay between the counter showing up and the counter being hidden again (in milliseconds) | 5000 (5 seconds) |
| Show/Set counter command | Twitch chat command for showing counter (if hidden) | !counter |
| Add counter command | Twitch chat command for adding 1 to the counter | !counterup |
| Subtract counter command | Twitch chat command for subtracting 1 from the counter | !counterdown |
| Reset counter command | Twitch chat command for resetting the counter to 0 | !counterreset |
| Initial value | First value when counter is loaded | 0 |

#### UI Customization
| Field | Description | Default Value |
| ------ | ------ | ------ |
| Border Radius | Background's Border Radius | 10
| Background Color | Color of the Background | rgba(255,255,255,0.75)
| Animation duration | Duration of the slide animation (if applicable) | 1000
| Hide delay (in ms) | Delay before hiding the counter | 5000

#### Typography
| Field | Default Value |
| ------ | ------ |
| Font Family | Montserrat
| Font Size | 50
| Font Weight | 400
| Font Color | rgba(255,255,255,1)

#### Hide Animation options
| Animation | Description |
| ------ | ------ |
| None | No hide animation, counter is permanently on overlay |
| Slide right | Hides the counter by sliding right |
| Slide left | Hides the counter by sliding left |
| Slide up | Hides the counter by sliding up |
| Slide down | Hides the counter by sliding down |