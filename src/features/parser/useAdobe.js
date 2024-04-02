import { useMutation } from "@tanstack/react-query";
import {
  createJob,
  fetchStatus,
  getAccessToken,
  getAsset,
  getURIUploadRequest,
  uploadAsset,
} from "../../services/apiAdobe";

// hooks for Adobe API

const addAccessToken = () => {
  return getAccessToken();
};

export const useAddAccessToken = () => {
  return useMutation(addAccessToken);
};

const addURIUploadRequest = (accessToken) => {
  return getURIUploadRequest(accessToken);
};

export const useGetURIUploadRequest = () => {
  return useMutation(addURIUploadRequest);
};

const addAsset = (payload) => {
  console.log(payload);
  return uploadAsset(payload);
};

export const useUploadAsset = () => {
  return useMutation(addAsset);
};

const addJob = (payload) => {
  return createJob(payload);
};

export const useCreateJob = () => {
  return useMutation(addJob);
};

const addStatus = (payload) => {
  return fetchStatus(payload);
};

export const useFetchStatus = () => {
  return useMutation(addStatus);
};

const addJSON = (downloadUri) => {
  return getAsset(downloadUri);
};

export const useGetAsset = () => {
  return useMutation(addJSON);
};
