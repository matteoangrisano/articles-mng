const mappingTemplatesPath = "articles";

export const mappingTemplates = [
  {
    field: "listTenants",
    type: "Query",
    request: `${mappingTemplatesPath}/Query.listTenants.request.vtl`,
    response: `${mappingTemplatesPath}/Query.listTenants.response.vtl`,
    dataSource: "tenant_datasource",
  },
  {
    field: "addTenant",
    type: "Mutation",
    request: `${mappingTemplatesPath}/Mutation.addTenant.request.vtl`,
    response: `${mappingTemplatesPath}/Mutation.addTenant.response.vtl`,
    dataSource: "StepFunctionsDataSource",
  },
];

export const dataSource = [
  {
    type: "AMAZON_DYNAMODB",
    name: "tenant_datasource",
    description: "tenant_datasource",
    config: {
      tableName:
        "${cf:cdk-${self:service}-${self:provider.stage}.DynamoDBTableTenant}",
      serviceRoleArn:
        "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    },
  },
  {
    type: "HTTP",
    name: "StepFunctionsDataSource",
    config: {
      endpoint: "https://sync-states.${self:provider.region}.amazonaws.com/",
      serviceRoleArn:
        "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
      authorizationConfig: {
        authorizationType: "AWS_IAM",
        awsIamConfig: {
          signingRegion: "${self:provider.region}",
          signingServiceName: "states",
        },
      },
    },
  },
  {
    type: "AMAZON_DYNAMODB",
    name: "group_datasource",
    description: "group_datasource",
    config: {
      tableName:
        "${cf:cdk-${self:service}-${self:provider.stage}.DynamoDBTableUserGroup}",
      serviceRoleArn:
        "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    },
  },
  {
    type: "AMAZON_DYNAMODB",
    name: "user_profile_datasource",
    description: "user_profile_datasource",
    config: {
      tableName:
        "${cf:cdk-${self:service}-${self:provider.stage}.DynamoDBTableUserProfile}",
      serviceRoleArn:
        "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    },
  },
  {
    type: "AMAZON_DYNAMODB",
    name: "permission_datasource",
    description: "permission_datasource",
    config: {
      tableName:
        "${cf:cdk-${self:service}-${self:provider.stage}.DynamoDBTablePermission}",
      serviceRoleArn:
        "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    },
  },
];

export const substitutions = {
  STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:add-tenant-${self:service}-${self:provider.stage}",
  ADD_SUPER_U_USER_STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:add-super-u-user-${self:service}-${self:provider.stage}",
  UPDATE_SUPER_U_USER_STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:update-super-u-user-${self:service}-${self:provider.stage}",
  DELETE_SUPER_U_USER_STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:delete-super-u-user-${self:service}-${self:provider.stage}",
  DELETE_TENANT_STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:delete-tenant-${self:service}-${self:provider.stage}",
  ADD_USER_GROUP_STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:add-user-group-super-u-${self:service}-${self:provider.stage}",
  DELETE_SUPER_U_GROUP_STATEMACHINEARN:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:delete-super-u-group-${self:service}-${self:provider.stage}",
  ADD_DEFAULT_GROUPS:
    "arn:aws:states:${self:provider.region}:${aws:accountId}:stateMachine:add-default-groups-${self:service}-${self:provider.stage}",
};
