import { createElement as h, useState } from 'react'
import PropTypes from 'prop-types'

import { REFERRERS_SORTING_NEW, REFERRERS_SORTING_RECENT } from '../../../../constants/referrers'
import { LAST_7_DAYS, LAST_30_DAYS, ALL_TIME } from '../../../../constants/dateRange'

import Headline from '../Headline'
import Text from '../Text'
import PresentationIconList from '../presentations/PresentationIconList'
import PresentationEmptyState, { ICON_LOADING, ICON_WARNING } from '../presentations/PresentationEmptyState'
import relativeDate from '../../utils/relativeDate'

const textLabel = (item, dateRange, isRecent, isNew) => {

	if (isRecent && !item) return 'Recent'
	if (isNew && !item) return 'New'
	if (item && item.date) return relativeDate(item.date)
	if (item && item.count) return `${ item.count } ${ item.count === 1 ? 'visit' : 'visits' }`
	if (dateRange) {
		const range = [ ALL_TIME, LAST_7_DAYS, LAST_30_DAYS ].find((range) => range.value === dateRange)
		if (range) return range.label
	}

	return LAST_7_DAYS.label

}

const CardReferrers = (props) => {

	// Index of the active element
	const [ active, setActive ] = useState()

	const onEnter = (index) => setActive(index)
	const onLeave = () => setActive()

	const presentation = (() => {

		if (props.loading === true) return h(PresentationEmptyState, {
			icon: ICON_LOADING
		}, 'Loading referrers')

		const hasItems = props.items.length > 0

		if (hasItems === true) return h(PresentationIconList, {
			items: props.items,
			onEnter,
			onLeave
		})

		return h(PresentationEmptyState, {
			icon: ICON_WARNING
		}, 'No referrers')

	})()

	return (
		h('div', {
			className: 'card'
		},
			h('div', { className: 'card__inner' },
				h(Headline, {
					type: 'h2',
					small: true,
					className: 'color-white'
				}, props.headline),
				h(Text, {
					spacing: false
				}, textLabel(
					props.items[active],
					props.dateRange,
					props.sorting === REFERRERS_SORTING_RECENT,
					props.sorting === REFERRERS_SORTING_NEW)
				),
				presentation
			)
		)
	)

}

CardReferrers.propTypes = {
	headline: PropTypes.string.isRequired,
	dateRange: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	items: PropTypes.array.isRequired
}

export default CardReferrers