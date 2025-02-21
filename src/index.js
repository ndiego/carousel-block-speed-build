import { registerBlockType } from '@wordpress/blocks';
import { 
	useBlockProps, 
	InnerBlocks, 
	InspectorControls,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'core/cover' ];
const TEMPLATE = [
	[ 'core/cover', {} ],
	[ 'core/cover', {} ],
];

function Edit( { 
	attributes, 
	setAttributes,
	arrowColor,
	setArrowColor,
	style,
	clientId,
} ) {
	const { slidesToShow, gap, customArrowColor, minHeight, loop } = attributes;
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const blockProps = useBlockProps( {
		style: {
			...style,
			'--carousel-arrow-color': arrowColor?.slug 
				? `var(--wp--preset--color--${ arrowColor.slug })` 
				: customArrowColor,
			'--slides-to-show': slidesToShow,
			'--carousel-gap': `${ gap }px`,
			'--carousel-min-height': `${ minHeight }px`,
		},
	} );

	const arrowColorDropdown = (
		<ColorGradientSettingsDropdown
			settings={ [ {
				label: __( 'Arrow Color', 'my-block-plugin' ),
				colorValue: arrowColor?.color || customArrowColor,
				onColorChange: ( value ) => {
					setArrowColor( value );
					setAttributes( { customArrowColor: value } );
				},
			} ] }
			panelId={ clientId }
			hasColorsOrGradients={ false }
			disableCustomColors={ false }
			__experimentalIsRenderedInSidebar
			{ ...colorGradientSettings }
		/>
	);

	return (
		<>
			<InspectorControls group="color">
				{ arrowColorDropdown }
			</InspectorControls>
			<InspectorControls>
				<PanelBody title={ __( 'Carousel Settings', 'my-block-plugin' ) }>
					<RangeControl
						label={ __( 'Slides to Show', 'my-block-plugin' ) }
						value={ slidesToShow }
						onChange={ ( value ) => setAttributes( { slidesToShow: value } ) }
						min={ 1 }
						max={ 3 }
					/>
					<RangeControl
						label={ __( 'Gap Between Slides (px)', 'my-block-plugin' ) }
						value={ gap }
						onChange={ ( value ) => setAttributes( { gap: value } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Minimum Height (px)', 'my-block-plugin' ) }
						value={ minHeight }
						onChange={ ( value ) => setAttributes( { minHeight: value } ) }
						min={ 200 }
						max={ 1000 }
						step={ 10 }
					/>
					<ToggleControl
						label={ __( 'Loop Slides', 'my-block-plugin' ) }
						checked={ loop }
						onChange={ ( value ) => setAttributes( { loop: value } ) }
						help={ loop ? 
							__( 'Carousel will loop continuously.', 'my-block-plugin' ) : 
							__( 'Carousel will stop at the end.', 'my-block-plugin' ) 
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="carousel-editor">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
						orientation="horizontal"
					/>
				</div>
			</div>
		</>
	);
}

const EditWithColors = withColors( {
	arrowColor: 'arrow-color',
} )( Edit );

registerBlockType( 'speed-build/carousel', {
	edit: EditWithColors,
	save: function Save( { attributes } ) {
		const { slidesToShow, gap, arrowColor, customArrowColor, minHeight, loop } = attributes;
		
		const blockProps = useBlockProps.save( {
			style: {
				...attributes.style,
				'--carousel-arrow-color': arrowColor 
					? `var(--wp--preset--color--${ arrowColor })` 
					: customArrowColor,
				'--carousel-min-height': `${ minHeight }px`,
			},
		} );

		return (
			<div { ...blockProps }>
				<div 
					className="splide carousel-container"
					data-slides-to-show={ slidesToShow }
					data-gap={ gap }
					data-loop={ loop }
				>
					<div className="splide__track">
						<ul className="splide__list">
							<InnerBlocks.Content />
						</ul>
					</div>
				</div>
			</div>
		);
	},
} ); 