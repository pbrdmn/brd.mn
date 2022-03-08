---
title: Arduino
date: 2012-05-30
---

I picked up some arduino boards a few months ago and built a simple digital thermometer with a 4 digit 7-segment LED display. This worked reasonably, aside from some poor connections caused by prototyping on a breadboard.

Unfortunately, the poor connections meant that the temperature did not update reliably, so I replaced the project with a $2 off-the-shelf unit.

But after stumbling across this [Printer project](http://gofreerange.com/printer) I think I might have found my next job for the boards I have.

I imagine this would be fun to have and perhaps even a little useful. I would like to add a [knock sensor](http://www.arduino.cc/en/Tutorial/KnockSensor) to the project to trigger a print, so I could knock on the desk and have my schedule, reminders, [weather forecast](http://brd.mn/w) and whatever else printed.

Project Goals:

*   Fully Arduino/cloud controlled printing (no local PC)
*   Use the Go Free Range services/source
*   Poll and cache data for offline printing
*   Scheduled and on demand printing
*   Use a knock sensor with different patterns to print different jobs (e.g. two knocks for weather, three for calendar schedule, etc)

Project steps:

1.  Build a parts list
2.  Inventory my parts
3.  Build a shopping list