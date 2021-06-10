# StreamElements Poll Widget

Basic poll widget for StreamElements, can be controlled and updated by using twitch chat commands with up to 5 options for the poll. Each option submitted when a poll is created gets assigned a number visible on the poll widget, and viewers can type that number to cast in their vote.

## Features

#### Twitch Chat Integration
The following Twitch chat commands can control the poll. These commands can be customized by changing the widget settings. (See section on **Customizable Settings**)
| Command | Description | Usage |
| ------ | ------ | ------ |
| !poll | Hide/show the widget. **Can only be used by the broadcaster and mods**. | `!poll` |
| !poll <Poll name>,<option1>,<option2>..<option5> | Twitch chat command for creating a new poll. Separate poll arguments via commas.  **Can only be used by the broadcaster and mods**. | `!poll Which is better,Coca-cola,Pepsi,Mountain Dew,Water KEKW` |

#### Customizable Settings
The following can be customized by accessing the widget settings (excluding font settings):

| Field | Description | Default Value |
| ------ | ------ | ------ |
| Poll Label | Label for the poll | Poll |
| Hide animation | Animation style for the poll if not permanently on the overlay (See section on **Hide Animation options**)| None |
| Hide delay | Delay between the poll showing up and the poll being hidden again (in milliseconds) | 5000 (5 seconds) |
| Start poll command | Twitch chat command for showing/hiding/starting the poll | !poll |
| Background color | Set background color for the poll via colorpicker | rgba(51, 49, 49, 0.7) |
| Border color | Set border color for the poll via colorpicker | rgba(255, 255, 255, 1) |
| Accent color | Set accent color for the poll options' numbering and vote bar via colorpicker | rgba(255, 255, 255, 1) |

#### Hide Animation options
| Animation | Description |
| ------ | ------ |
| None | No hide animation, poll is permanently on overlay |
| Slide right | Hides the poll by sliding right |
| Slide left | Hides the poll by sliding left |
| Slide up | Hides the poll by sliding up |
| Slide down | Hides the poll by sliding down |