len Mapping:

Estos son los campos interesantes y los plug-ins que los generan.
<!-- REGEX para encontrar campos no indexados: ^\|[a-zA-Z0-9 ]*\|[a-zA-Z0-9 ]*\|[ ]+\| -->

### Essentials
|field|type|indexed|multivalued|
|-|-|-|-|
| id            | string  | YES ||
| \_version\_   | long    | YES ||

## Core
|field|type|indexed|multivalued|
|-|-|-|-|
| segment   | string  |  ||
| digest    | string  |  ||
| boost     | float   | YES ||

## `index-basic`
|field|type|indexed|multivalued|
|-|-|-|-|
| host    | url           | YES   ||
| url     | url           | YES   ||
| content | text_general  | YES   ||
| title   | text_general  | YES   ||
| cache   | string        | YES   ||
| tstamp  | date          | YES   ||

### `catch-all`
|field|type|indexed|multivalued|
|-|-|-|-|
| text | text_general | YES | YES |

### `index-anchor`
|field|type|indexed|multivalued|
|-|-|-|-|
| anchor | text_general | YES ||

### `index-more`
|field|type|indexed|multivalued|
|-|-|-|-|
| type | string | YES | YES |
| contentLength | long | YES ||
| lastModified | date | YES ||
| date | tdate | YES ||

### `index-metadata`
|field|type|indexed|multivalued|
|-|-|-|-|
| description | text_general | YES ||
| keywords | string | YES | YES |

### `index-links`
|field|type|indexed|multivalued|
|-|-|-|-|
| outlinks | string | YES | YES |
| inlinks | string | YES | YES |

### `headings`
|field|type|indexed|multivalued|
|-|-|-|-|
| h1 | text_general | YES | YES |
| h2 | text_general | YES | YES |

### `languageidentifier`
|field|type|indexed|multivalued|
|-|-|-|-|
| lang | string | YES ||

### `subcollection`
|field|type|indexed|multivalued|
|-|-|-|-|
| subcollection | string | | YES |

### `creativecommons`
|field|type|indexed|multivalued|
|-|-|-|-|
| cc | string | YES | YES |

### `tld`
|field|type|indexed|multivalued|
|-|-|-|-|
| tld | string | YES | |
