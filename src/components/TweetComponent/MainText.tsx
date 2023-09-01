/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';
import * as Re from 'remeda';
import { randomNum } from '../../utilfuncs/randomNum';
import { COLOR_LINK, SIZE_TEXT_M, SIZE_TEXT_S } from './consts';
import { t_urls } from './types';

export function MainTextM(props: { text: string; urls: t_urls[] | undefined }) {
	return (
		<div
			css={[styles.textBase, styles.textM]}
			//html entitiesとかをエスケープしない。元データが既にエスケープされているので2重のエスケープになってしまう。
		>
			{mainText(props.text, props.urls)}
		</div>
	);
}

export function MainTextS(props: { text: string; urls: t_urls[] | undefined }) {
	return <div css={[styles.textBase, styles.textS]}>{mainText(props.text, props.urls)}</div>;
}

function mainText(text: string, urls: t_urls[] | undefined) {
	const _urls = urls ?? [];
	return Re.pipe(
		text,
		addHashtag,
		addMention,
		//(t) => he.decode(t),
		(t) => (_urls.length === 0 ? t : addUrl(t, _urls)),
		removeMediaUrl,
		wrapWithP,
	);
}

function wrapWithP(text: string | ReactNode[]) {
	return reactStringReplace(text, /(.*)\n/g, (match, i) => (
		<p css={styles.para} key={match + randomNum()}>
			{match}
		</p>
	));
	/*
	const reg = new RegExp('(.*)\\n', 'g');

	return text.match(reg)
		? reactStringReplace(text, reg, (match, i) => (
				<p css={styles.para} key={match + i}>
					{match}
				</p>
		  ))
		: reactStringReplace(text, /(.*)/, (match, i) => (
				<p css={styles.para} key={match + i}>
					{match}
				</p>
		  ));
			*/
}

function breakLine(text: string) {
	return text.replace(/\n/g, '<br>');
}
function addMention(text: string | ReactNode[]) {
	return reactStringReplace(text, /[@]{1}(\w+)/g, (match, i) => (
		<span css={styles.textEntities} key={match + randomNum()}>
			@{match}
		</span>
	));

	//return text.replace(/[@]{1}(\w+)/g, `<span style="color: ${COLOR_LINK}">@$1 </span>`);
	/*
	return mentions.reduce((accumulator, currentValue) => {
		const reg = new RegExp(`@${currentValue.screen_name}`, 'g');
		return accumulator.replace(reg, `<span style="color: ${COLOR_LINK}">＠${currentValue.screen_name}</span>`);
	}, text);
	*/
}

function addUrl(text: string | ReactNode[], urls: t_urls[]): string | ReactNode[] {
	let replacedText: string | ReactNode[] = text;
	for (let index = 0; index < urls.length; index++) {
		const currentValue = urls[index];
		const reg = new RegExp(`(${currentValue.url})`, 'g');
		replacedText = reactStringReplace(replacedText, reg, (match, i) => (
			<a
				key={match + randomNum()}
				href={currentValue.expanded_url}
				css={styles.textEntities}
				target='_blank'
				rel='noreferrer'
				onClick={(event) => {
					//オプションが開くのを防ぐ
					event.stopPropagation();
				}}
				onMouseEnter={(event) => {
					event.currentTarget.style.textDecoration = 'underline';
				}}
				onMouseOut={(event) => {
					event.currentTarget.style.textDecoration = 'none';
				}}
			>
				{currentValue.display_url}
			</a>
		));
	}
	return replacedText;

	/*
		const a = urls.reduce((accumulator: string | ReactNode[], currentValue) => {
		const reg = new RegExp(currentValue.url, 'g');
		return reactStringReplace(accumulator, reg, (match, i) => (
			<a key={match + i} href={currentValue.expanded_url}>
				{currentValue.display_url}
			</a>
		));
	}, text);
	console.log(a);
	return a;

	
	return urls.reduce((accumulator, currentValue) => {
		const reg = new RegExp(currentValue.url, 'g');
		return accumulator.replace(
			reg,
			`<a style="color: ${COLOR_LINK}" href="${currentValue.expanded_url}">${currentValue.display_url}</a>`,
		);
	}, text);
	*/
}
function addHashtag(text: string | ReactNode[]) {
	return reactStringReplace(text, /[＃#]{1}(\S+)/gu, (match, i) => (
		<span css={styles.textEntities} key={match + randomNum()}>
			#{match}
		</span>
	));
	/*
	const r = text.replace(
		/((?:^|\s|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F))[＃#]{1}(\S+)/gu,
		`$1<span style="color: ${COLOR_LINK}">#$2</span>`,
	);

	return r;
	*/
}
/**
 * メディアURLを除去する
 * 最後に実行すること
 */
function removeMediaUrl(text: string | ReactNode[]) {
	//https://t.co/~~
	return reactStringReplace(text, /(https:\/\/t\.co\/\w+)/g, (match, i) => '');
	//return text.replace(/https:\/\/t\.co\/\w+/g, '');
}

const styles = {
	textBase: css({
		color: 'rgb(15, 20, 25)',
		textAlign: 'left',
	}),
	textM: css({
		fontSize: SIZE_TEXT_M,
		//lineHeight: '24px',
	}),
	textS: css({
		fontSize: SIZE_TEXT_S,
		//lineHeight: '20px',
	}),
	para: css({
		minHeight: '1rem',
	}),
	textEntities: css({
		color: COLOR_LINK,
	}),
};
