len Mapping:

Estos son los campos interesantes y los plug-ins que los generan.

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
| boost     | float   |  ||

## `index-basic`
|field|type|indexed|multivalued|
|-|-|-|-|
| host    | url           | YES   ||
| url     | url           | YES   ||
| content | text_general  | YES   ||
| title   | text_general  | YES   ||
| cache   | string        |  ||
| tstamp  | date          |  ||

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
| contentLength | long | ||
| lastModified | date | ||
| date | tdate | YES ||

### `index-metadata`
|field|type|indexed|multivalued|
|-|-|-|-|
| description | string | YES ||
| keywords | string | YES | YES |

### `languageidentifier`
|field|type|indexed|multivalued|
|-|-|-|-|
| lang | string | YES ||

### `subcollection`
|field|type|indexed|multivalued|
|-|-|-|-|
| subcollection | string | YES | YES |

### `creativecommons`
|field|type|indexed|multivalued|
|-|-|-|-|
| cc | string | YES | YES |

### `tld`
|field|type|indexed|multivalued|
|-|-|-|-|
| tld | string | | |

### `-addBinaryContent`

Este campo es activado cuando se lanza el proceso de indexación con `-addBinaryContent`

|field|type|indexed|multivalued|
|-|-|-|-|
| binaryContent | binary | | |
