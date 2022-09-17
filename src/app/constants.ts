export enum ImportStatus {
	IMPORT_SUCCESS = "IMPORT_SUCCESS",
	IMPORT_FAIL = "IMPORT_FAIL",
	EXECUTION_IN_PROGRESS = "EXECUTION_IN_PROGRESS",
	EXECUTION_SUCCESS = "EXECUTION_SUCCESS",
	EXECUTION_FAIL = "EXECUTION_FAIL"
}

export enum ExecutionStatus {
	NOT_STARTED = "NOT_STARTED",
	IMPORTED = "IMPORTED",
	IN_PROGRESS = "IN_PROGRESS",
	PAUSED = "PAUSED",
	COMPLETE = "COMPLETE"
}

export enum CsvColumnNames {
	ELECTOR_ID = "Elector ID",
	NAME = "Name",
	RC = "RC",
	PROPERTY_ADDRESS = "Property Address",
	STREET_NUMBER = "Street Number",
	STREET_NUMBER_SUFFIX = "Street Number Suffix",
	STREET_NAME = "Street Name",
	STREET_TYPE = "Street Type",
	UNIT_NUMBER = "Unit Number",
	VOTED = "Voted",
	LOCATION_NAME = "Location Name",
	RECORDED_DATE = "Recorded Date",
	VOTING_CHANNEL = "Voting Channel"
}

export enum VoterProperties {
	NAME = "name",
	PROPERTY_ADDRESS = "propertyAddress",
	HOUSE_NUM = "houseNum",
	STREET_SUFFIX = "streetSuffix",
	STREET_NAME = "streetName",
	STREET_TYPE = "streetType",
	APT_NUM = "aptNum",
	CITY = "city",
	SUPPORT = "support",
	ANSWERS = "answers",
	CANVASSED_BY = 'canvassedBy',
	CANVASSED_DATE = "canvassedDate",
	STATUS = "status",
	ID = "id",
	ELECTOR_ID = "electorId",
	RC = "rc",
	VOTED = "voted",
	LOCATION_NAME = "locationName",
	RECORDED_DATE = "recordedDate",
	VOTING_CHANNEL = "votingChannel",
}

export let CsvColumnToVoterMap = new Map()
	.set( CsvColumnNames.ELECTOR_ID, VoterProperties.ELECTOR_ID )
	.set( CsvColumnNames.NAME, VoterProperties.NAME )
	.set( CsvColumnNames.RC, VoterProperties.RC )
	.set( CsvColumnNames.PROPERTY_ADDRESS, VoterProperties.PROPERTY_ADDRESS )
	.set( CsvColumnNames.STREET_NUMBER, VoterProperties.HOUSE_NUM )
	.set( CsvColumnNames.STREET_NUMBER_SUFFIX, VoterProperties.STREET_SUFFIX )
	.set( CsvColumnNames.STREET_NAME, VoterProperties.STREET_NAME )
	.set( CsvColumnNames.STREET_TYPE, VoterProperties.STREET_TYPE )
	.set( CsvColumnNames.UNIT_NUMBER, VoterProperties.APT_NUM )
	.set( CsvColumnNames.VOTED, VoterProperties.VOTED )
	.set( CsvColumnNames.LOCATION_NAME, VoterProperties.LOCATION_NAME )
	.set( CsvColumnNames.RECORDED_DATE, VoterProperties.RECORDED_DATE )
	.set( CsvColumnNames.VOTING_CHANNEL, VoterProperties.VOTING_CHANNEL );

