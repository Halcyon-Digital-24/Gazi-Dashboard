export default function makeSlug (str: string): string  {
	str = str?.toLowerCase();

	str = str?.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-"); 
	return str;
}