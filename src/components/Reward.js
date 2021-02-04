/**
 * @license
 * Copyright (c) 2021 Marvin Schopf
 * Copyright (c) 2018-2020 thedevelobear
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import posed from "react-pose";

import confetti from "./Confetti";
import emoji from "./Emoji";

const transition = {
	type: "spring",
	stiffness: 200,
	damping: 2,
};

const SpringAnim = posed.div({
	confetti: {
		y: 5,
		transition,
	},
	emoji: {
		y: 5,
		transition,
	},
	punished: {
		x: 5,
		transition,
	},
	resting: {
		y: 0,
		x: 0,
		scale: 1,
		transition,
	},
});

export default class Reward extends Component {
	state = {
		state: "resting",
	};

	rewardMe = () => {
		const { type, config } = this.props;
		const props = [this.container, config];
		switch (type) {
			case "confetti": {
				this.handleAnimation(type);
				confetti(...props);
				break;
			}
			case "emoji": {
				this.handleAnimation(type);
				emoji(...props);
				break;
			}
			default: {
				break;
			}
		}
	};

	punishMe = () => {
		this.handlePunishAnimation();
	};

	rest = () => {
		setTimeout(() => {
			this.setState({ state: "resting" });
		}, 100);
	};

	handleAnimation = (type) => {
		this.setState({ state: type }, () => {
			this.rest();
		});
	};

	handlePunishAnimation = () => {
		this.setState({ state: "punished" }, () => {
			this.rest();
		});
	};

	render() {
		const { config, children } = this.props;
		const { springAnimation = true, containerStyle = {} } = config;
		const { state } = this.state;
		return (
			<React.Fragment>
				<div
					style={containerStyle}
					ref={(ref) => {
						this.container = ref;
					}}
				/>
				<div
					style={{ ...containerStyle, ...lottieContainerStyles }}
					ref={(ref) => {
						this.lottieContainer = ref;
					}}
				/>
				<SpringAnim pose={springAnimation && state}>{children}</SpringAnim>
			</React.Fragment>
		);
	}
}

const lottieContainerStyles = { position: "relative" };

Reward.propTypes = {
	type: PropTypes.string.isRequired,
	config: PropTypes.object,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

Reward.defaultProps = {
	config: {},
};
