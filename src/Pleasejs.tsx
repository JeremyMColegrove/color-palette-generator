import color_data from './colors'

export type RGB = {
	r: number
	g: number
	b: number
}

export type HSV = {
	h: number
	s: number
	v: number
}

type ColorFormats = 'hex' | 'rgb' | 'rgb-string' | 'hsv'

var make_scheme_default = {
	scheme_type: 'analogous',
	format: 'hex'
};

type makeColorDefault = {
	hue: number | null
	saturation: number | null
	value: number | null
	base_color: string
	greyscale: boolean
	grayscale: boolean //whatever I support them both, murrica
	golden: boolean
	full_random: boolean
	colors_returned: number
	format: ColorFormats
	seed: number | null
}
export type SchemeOptions = 'monochromatic' | 'mono' | 'complementary' |'complement' | 'comp' | 'split-complementary' | 'split-complement' | 'split' | 'double-complementary' | 'double-complement' | 'double' | 'analogous' | 'ana' | 'triadic' | 'triad' | 'tri'

type MakeSchemeOption = {
	scheme_type?: SchemeOptions 
	format?: ColorFormats
}

type MakeColorOption = {
	hue?: number | undefined
	saturation?: number | undefined
	value?: number | undefined
	base_color?: string | undefined
	greyscale?: boolean | undefined
	grayscale?: boolean | undefined
	golden?: boolean | undefined
	full_random?: boolean | undefined
	colors_returned?: number | undefined
	format?: string | undefined
}

export class ColorMutations {
	// Define color data
	static color_data: {[key: string]: string} = color_data

	constructor() {}

	/***
	 * convert color name into hex string
	 * @param {string} name
	 * @returns {string}
	 */
	static NAME_to_HEX(name: string): string | undefined {
		name = name.toLowerCase()
		if (name in ColorMutations.color_data) {
			// @ts-ignore
			return ColorMutations.color_data[name]
		} else {
			console.error('Color name not recognized.')
		}
	}

	/***
	 * convert color name into RGB
	 * @param {string} name
	 * @returns {RGB}
	 */
	static NAME_to_RGB(name: string): RGB | null {
		return this.HEX_to_RGB(ColorMutations.NAME_to_HEX(name) || '')
	}

	/***
	 * convert color name into RGB
	 * @param {string} name
	 * @returns {HSV}
	 */
	static NAME_to_HSV(name: string): HSV {
		return this.HEX_to_HSV(ColorMutations.NAME_to_HEX(name) || '')
	}

	/***
	 * convert HEX into RGB
	 * @param {string} hex
	 * @returns {RGB}
	 */
	static HEX_to_RGB(hex: string): RGB | null {
		var regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
		hex = hex.replace(regex, function (m, r, g, b) {
			return r + r + g + g + b + b
		})
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: null
	}

	/***
	 * convert RGB into HEX
	 * @param {RGB} rgb
	 * @returns {string}
	 */
	static RGB_to_HEX(rgb: RGB): string {
		return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
	}

	/***
	 * convert HSV into RGB
	 * @param {HSV} hsv
	 * @returns {RGB}
	 */
	static HSV_to_RGB(hsv: HSV): RGB {
		var h = hsv.h,
			s = hsv.s,
			v = hsv.v

		var r = 0,
			g = 0,
			b = 0

		var i, f, p, q, t

		if (s === 0) {
			return {
				r: v,
				g: v,
				b: v,
			}
		}
		h /= 60
		i = Math.floor(h)
		f = h - i
		p = v * (1 - s)
		q = v * (1 - s * f)
		t = v * (1 - s * (1 - f))

		switch (i) {
			case 0:
				r = v
				g = t
				b = p
				break
			case 1:
				r = q
				g = v
				b = p
				break
			case 2:
				r = p
				g = v
				b = t
				break
			case 3:
				r = p
				g = q
				b = v
				break
			case 4:
				r = t
				g = p
				b = v
				break
			case 5:
				r = v
				g = p
				b = q
				break
		}

		return {
			r: Math.floor(r * 255),
			g: Math.floor(g * 255),
			b: Math.floor(b * 255),
		}
	}

	/***
	 * convert RGB into HSV
	 * @param {RGB} rgb
	 * @returns {HSV}
	 */
	static RGB_to_HSV(rgb: RGB): HSV {
		var r = rgb.r / 255,
			g = rgb.g / 255,
			b = rgb.b / 255
		var computed_H = 0,
			computed_S = 0,
			computed_V = 0
		var min_RGB = Math.min(r, Math.min(g, b)),
			max_RGB = Math.max(r, Math.max(g, b))
		// Black-gray-white
		if (min_RGB === max_RGB) {
			computed_V = min_RGB
			return {
				h: 0,
				s: 0,
				v: computed_V,
			}
		}
		// Colors other than black-gray-white:
		var d = r === min_RGB ? g - b : b === min_RGB ? r - g : b - r
		var h = r === min_RGB ? 3 : b === min_RGB ? 1 : 5
		computed_H = 60 * (h - d / (max_RGB - min_RGB))
		computed_S = (max_RGB - min_RGB) / max_RGB
		computed_V = max_RGB
		return {
			h: computed_H,
			s: computed_S,
			v: computed_V,
		}
	}

	/***
	 * convert HSV into HEX
	 * @param {HSV} hsv
	 * @returns {string}
	 */
	static HSV_to_HEX(hsv: HSV): string {
		return ColorMutations.RGB_to_HEX(ColorMutations.HSV_to_RGB(hsv))
	}

	/***
	 * convert HEX into HSV
	 * @param {string} hex
	 * @returns {HSV}
	 */
	static HEX_to_HSV(hex: string): HSV {
		return ColorMutations.RGB_to_HSV(ColorMutations.HEX_to_RGB(hex) || {r: 10, g: 10, b: 0})
	}
}

class RC4Random {
	key_schedule: number[] = []
	key_schedule_i = 0
	key_schedule_j = 0

	constructor(seed: string) {
		for (var k = 0; k < 256; k++) this.key_schedule[k] = k

		for (var i = 0, j = 0; i < 256; i++) {
			j = (j + this.key_schedule[i] + seed.charCodeAt(i % seed.length)) % 256
			var t = this.key_schedule[i]
			this.key_schedule[i] = this.key_schedule[j]
			this.key_schedule[j] = t
		}
	}

	get_random_byte() {
		this.key_schedule_i = (this.key_schedule_i + 1) % 256
		this.key_schedule_j = (this.key_schedule_j + this.key_schedule[this.key_schedule_i]) % 256
		var t = this.key_schedule[this.key_schedule_i]
		this.key_schedule[this.key_schedule_i] = this.key_schedule[this.key_schedule_j]
		this.key_schedule[this.key_schedule_j] = t
		return this.key_schedule[(this.key_schedule[this.key_schedule_i] + this.key_schedule[this.key_schedule_j]) % 256]
	}

	random() {
		for (var i = 0, number = 0, multiplier = 1; i < 8; i++) {
			number += this.get_random_byte() * multiplier
			multiplier *= 256
		}
		return number / 18446744073709551616
	}
}

export class ColorUtils {
	constructor() {}

	static copy_object(object: any): any {
		var copy = {}
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				//@ts-ignore
				copy[key] = object[key]
			}
		}
		return copy
	}

	static random_int(min: number, max: number, randomiser: RC4Random | null): number {
		var random = Math.random
		if (randomiser instanceof RC4Random) {
			random = randomiser.random
		}
		return Math.floor(random() * (max - min + 1)) + min
	}

	static random_float(min: number, max: number, randomiser: RC4Random | null): number {
		var random = Math.random
		if (randomiser instanceof RC4Random) {
			random = randomiser.random
		}
		return random() * (max - min) + min
	}

	static clamp(num: number, min: number, max: number): number {
		return Math.max(min, Math.min(num, max))
	}

	// Inside the ColorUtils class
	static convert_to_format(format_string: ColorFormats, array: (string | RGB | HSV)[]): (string | RGB | HSV)[] {
		var i
		switch (format_string) {
			case 'hex':
				const hex: string[] = Array.from(Array(array.length))
				for (i = 0; i < hex.length; i++) {
					hex[i] = ColorMutations.HSV_to_HEX(array[i] as HSV)
				}
				return hex
			case 'rgb':
				const rgb: RGB[] = Array.from(Array(array.length))
				for (i = 0; i < rgb.length; i++) {
					rgb[i] = ColorMutations.HSV_to_RGB(array[i] as HSV)
				}
				return rgb
			case 'rgb-string':
				const rgbString: string[] = Array.from(Array(array.length))
				for (i = 0; i < rgbString.length; i++) {
					var raw_rgb = ColorMutations.HSV_to_RGB(array[i] as HSV)
					rgbString[i] = `rgb(${raw_rgb.r},${raw_rgb.g},${raw_rgb.b})`
				}
				return rgbString
			case 'hsv':
				// If 'hsv' format is requested, return the original array
				return array as HSV[]
			default:
				console.error('Format not recognized.')
				break
		}
		return []
	}
}

export default class Please {
	// Define default color options
	static make_color_default: makeColorDefault = {
		hue: null,
		saturation: null,
		value: null,
		base_color: '',
		greyscale: false,
		grayscale: false,
		golden: true,
		full_random: false,
		colors_returned: 1,
		format: 'hex',
		seed: null,
	}

	static PHI = 0.618033988749895

	// Generate and return a random color
	static make_color(options?: MakeColorOption): Array<string | RGB | HSV> {
		const color: Array<string | RGB | HSV> = []
		const color_options: makeColorDefault = {...this.make_color_default}
		let base_color: HSV | null = null

		if (options) {
			// Override base Please options
			Object.assign(color_options, options)
		}

		const randomiser = color_options.seed ? new RC4Random(color_options.seed.toString()) : null

		if (color_options.base_color.length > 0) {
			base_color = color_options.base_color.match(/^#?([0-9a-f]{3})([0-9a-f]{3})?$/i)
				? ColorMutations.HEX_to_HSV(color_options.base_color)
				: ColorMutations.NAME_to_HSV(color_options.base_color)
		}

		for (let i = 0; i < color_options.colors_returned; i++) {
			const random_hue = ColorUtils.random_int(0, 360, randomiser)
			let hue, saturation, value

			if (base_color !== null) {
				hue = ColorUtils.clamp(ColorUtils.random_int(base_color.h - 5, base_color.h + 5, randomiser), 0, 360)

				if (base_color.s === 0) {
					saturation = 0
				} else {
					saturation = ColorUtils.random_float(0.4, 0.85, randomiser)
				}

				value = ColorUtils.random_float(0.4, 0.85, randomiser)

				color.push({h: hue, s: saturation, v: value})
			} else {
				hue =
					color_options.greyscale || color_options.grayscale
						? 0
						: color_options.golden
							? (random_hue + random_hue / this.PHI) % 360
							: color_options.hue === null || color_options.full_random
								? random_hue
								: ColorUtils.clamp(color_options.hue, 0, 360)

				saturation =
					color_options.greyscale || color_options.grayscale
						? 0
						: color_options.full_random
							? ColorUtils.random_float(0, 1, randomiser)
							: color_options.saturation === null
								? 0.4
								: ColorUtils.clamp(color_options.saturation, 0, 1)

				value = color_options.full_random
					? ColorUtils.random_float(0, 1, randomiser)
					: color_options.greyscale || color_options.grayscale
						? ColorUtils.random_float(0.15, 0.75, randomiser)
						: color_options.value === null
							? 0.75
							: ColorUtils.clamp(color_options.value, 0, 1)

				color.push({h: hue, s: saturation, v: value})
			}
		}

		return ColorUtils.convert_to_format(color_options.format, color)
	}


	//accepts HSV object and options object, returns list or single object depending on options
	static make_scheme( HSV?:HSV, options?:MakeSchemeOption ): Array<string | RGB | HSV>{
		//clone base please options
		var scheme_options = ColorUtils.copy_object( make_scheme_default ),
		adjusted,
		secondary,
		adjusted_h,
		adjusted_s,
		adjusted_v,
		i;

		if( options !== null ){
		//override base Please options
			for( var key in options ){
				if( options.hasOwnProperty( key )){
					scheme_options[key] = options[key];
				}
			}
		}

		var scheme = [HSV];
		//DRY for repeated cloning
		function clone( HSV ){
			return{
				h: HSV.h,
				s: HSV.s,
				v: HSV.v
			};
		}
		switch( scheme_options.scheme_type.toLowerCase() ){
			case 'monochromatic':
			case 'mono':
				for ( i = 1; i <= 2; i++ ) {

					adjusted = clone( HSV );

					adjusted_s = adjusted.s + ( 0.1 * i );
					adjusted_s = ColorUtils.clamp( adjusted_s, 0, 1 );

					adjusted_v = adjusted.v + ( 0.1 * i );
					adjusted_v = ColorUtils.clamp( adjusted_v, 0, 1 );

					adjusted.s = adjusted_s;
					adjusted.v = adjusted_v;

					scheme.push( adjusted );
				}
				for ( i = 1; i <= 2; i++ ) {

					adjusted = clone( HSV );

					adjusted_s = adjusted.s - ( 0.1 * i );
					adjusted_s = ColorUtils.clamp( adjusted_s, 0, 1 );

					adjusted_v = adjusted.v - ( 0.1 * i );
					adjusted_v = ColorUtils.clamp( adjusted_v, 0, 1 );

					adjusted.s = adjusted_s;
					adjusted.v = adjusted_v;

					scheme.push( adjusted );
				}
			break;
			case 'complementary':
			case 'complement':
			case 'comp':
				adjusted = clone( HSV );
				adjusted.h = ( adjusted.h + 180 ) % 360;
				scheme.push( adjusted );
			break;
			//30 degree seperation
			case 'split-complementary':
			case 'split-complement':
			case 'split':
				adjusted = clone( HSV );
				adjusted.h = ( adjusted.h + 165 ) % 360;
				scheme.push( adjusted );
				adjusted = clone( HSV );
				adjusted.h = Math.abs( ( adjusted.h - 165 ) % 360 );
				scheme.push( adjusted );
			break;
			case 'double-complementary':
			case 'double-complement':
			case 'double':
				//first basic complement
				adjusted = clone( HSV );
				adjusted.h = ( adjusted.h + 180 ) % 360;
				scheme.push( adjusted );
				//then offset
				adjusted.h = ( adjusted.h + 30 ) % 360;
				secondary = clone( adjusted );
				scheme.push( adjusted );
				//complement offset
				adjusted.h = ( adjusted.h + 180 ) % 360;
				scheme.push( secondary );
			break;
			case 'analogous':
			case 'ana':
				for ( i = 1; i <= 5; i++ ) {
					adjusted = clone( HSV );
					adjusted.h = ( adjusted.h + ( 20 * i ) ) % 360;
					scheme.push( adjusted );
				}
			break;
			case 'triadic':
			case 'triad':
			case 'tri':
				for ( i = 1; i < 3; i++ ) {
					adjusted = clone( HSV );
					adjusted.h = ( adjusted.h + ( 120 * i ) ) % 360;
					scheme.push( adjusted );
				}
			break;
			default:
				console.error( 'Color scheme not recognized.' );
			break;
		}
		
		return ColorUtils.convert_to_format( scheme_options.format.toLowerCase(), scheme );
	};
}
