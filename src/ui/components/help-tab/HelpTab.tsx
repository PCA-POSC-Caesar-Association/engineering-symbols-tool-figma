import React from "react";

import "./HelpTab.css";
import logo from "./github-mark.png";

export function HelpTab() {
  return (
    <div className="help">
      <h3>Geometry only SVG</h3>
      <p>
        The main purpos of this Figma plugin, is to convert a svg into a <i>Geometry only SVG</i>.
        This means that the only relevant part of an svg is the <i>d</i> attribute of the <i>path</i> element.
      </p>
      <h3>What does the plugin do?</h3>
      <p>
        To simulate the stroke-width attribute, the plugin extends the path.
        To regulate the filling of the symbol, we have to define the directions of the
        already exisiting path for the symbol and the newly created path. In the
        <i> Fill Rule Editor</i>, click on the closed paths to change the direction and set the fill rules.
        For this we use the non-zero fill rule. In the <i>Fill Rule Editor</i> the areas with odd-even paths will be marked as red. Click on them to convert to non-zero.
      </p>
      <h4>The non-zero fill rule</h4>
      <p>The value nonzero determines the "insideness" of a point in the shape by drawing a ray from that
        point to infinity in any direction, and then examining the places where a segment of the shape
        crosses the ray. Starting with a count of zero, add one each time a path segment crosses the ray
        from left to right and subtract one each time a path segment crosses the ray from right to left.
        After counting the crossings, if the result is zero then the point is outside the path. Otherwise, it is
        inside.</p>

      <h3>Export As SVG</h3>
      <p>On <i>Export As SVG</i> in the <i>Export</i> tab, the following attributes will be removed from the element:
        <ul>
          <li>fill-rule</li>
          <li>clip-rule</li>
          <li>fill</li>
          <li>stroke</li>
        </ul>
        as all of this information will now be stored in the path attribute.
      </p>
      <h4>PCA symbol Editor</h4>
      <p>
        This plugin is developed as a help tool for creating symbols for the PCA Symbol Editor.
        The editor requires the width and height for the svg to scale consistently with a base unit of 12, i.e. only use multiples of 12px as its sizing reference.
        Hence the warning that might be displayed in the <i>Export</i> tab. However, if you are using this plugin for another use-case, feel free to ignore this warning.
      </p>
    </div>
  );
}
